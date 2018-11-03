import path from 'path';
import fs from 'fs';
import extend from 'extend2';
import { importFile } from './util';

const cwd = process.cwd();
const env = process.env.NODE_ENV || 'production';
const isProd = env === 'production';
const configPath = path.resolve('config');

const log4jsFileConfig = {
    type: 'dateFile',
    keepFileExt: true
};

const defaultPath = {
    root        : cwd,
    server      : path.join(cwd, 'server'),
    services    : path.join(cwd, 'server/service'),
    middlewares : path.join(cwd, 'server/middleware'),
    controllers : path.join(cwd, 'server/controller'),
    models      : path.join(cwd, 'server/model'),
    aop         : path.join(cwd, 'server/aop')
};

const defaults = {
    env,
    isProd,
    port: 8080,
    middlewares: [],
    path: defaultPath,
    onlyServer: true,           // 只有服务端接口
    pluginConfig: false,        // monking plugin config, type: array
    log4js: {
        appenders: {
            console: {
                type: 'console'
            },
            appFile: Object.assign({
                filename: '/tmp/monking/app.log'
            }, log4jsFileConfig),
            contextFile: Object.assign({
                filename: '/tmp/monking/context.log'
            }, log4jsFileConfig)
        },
        categories: {
            default: {
                appenders: ['console'],
                level: 'debug'
            },
            app: {
                appenders: [isProd ? 'appFile' : 'console'],
                level: isProd ? 'info' : 'debug'
            },
            context: {
                appenders: [isProd ? 'contextFile' : 'console'],
                level: isProd ? 'info' : 'debug'
            }
        },
        pm2: isProd
    },
    // koa-static options
    serverCache: {
        maxAge: isProd ? 604800000 : 0,  // 一周
        buffer: isProd,
        dynamic: true,
        preload: false
    },
    // koa-bodyparser options
    bodyParser: {
    },
    bodyParserDisable: ['get', 'head', 'options', 'trace', 'track'],
    // https://github.com/koajs/session
    session: {
        keys: [],
        options: {}
    },
    // https://github.com/koajs/csrf
    csrf: {},
    xst: ['trace', 'track', 'options'],

    redirectWhiteList: [],
    // 公共相应头
    responseHeader: {
        // iframe 钓鱼
        'X-Frame-Options': {
            enable: true,
            value: 'SAMEORIGIN'
        }
    }
};

const getUserConfig = (...files) => {
    const result = [];
    files.forEach(file => {
        const filePath = path.join(configPath, `${file}.js`);
        if (fs.existsSync(filePath)) {
            result.push(importFile(filePath));
        }
    });
    return result;
};

const userConfig = extend(true, {}, ...getUserConfig('default', env, 'local'));

let pluginConfig = {};

if (userConfig.pluginConfig && userConfig.pluginConfig.length > 0) {
    pluginConfig = userConfig.pluginConfig.reduce((result, item) => extend(true, result, importFile(item)), {});
}

export default extend(true, defaults, pluginConfig, userConfig);
