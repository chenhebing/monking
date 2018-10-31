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
    public      : path.join(cwd, 'static'),
    client      : path.join(cwd, 'client'),
    lib         : path.join(cwd, 'lib'),
    pages       : path.join(cwd, 'client/page'),
    components  : path.join(cwd, 'client/component'),
    assets      : path.join(cwd, 'client/asset'),
    styles      : path.join(cwd, 'client/style'),
    server      : path.join(cwd, 'server'),
    templates   : path.join(cwd, 'server/template'),
    services    : path.join(cwd, 'server/service'),
    middlewares : path.join(cwd, 'server/middleware'),
    controllers : path.join(cwd, 'server/controller'),
    models      : path.join(cwd, 'server/model'),
    aop         : path.join(cwd, 'server/aop')
};

const alias = {
    '@page': defaultPath.pages,
    '@component': defaultPath.components,
    '@style': defaultPath.styles,
    '@asset': defaultPath.assets,
    '@lib': defaultPath.lib
};

const defaults = {
    env,
    isProd,
    port: 8080,
    template: 'layout.html',
    ssrRender: true,
    middlewares: [],
    path: defaultPath,
    alias,
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
    },
    mongodb: {
    }
};

const getConfig = (...files) => {
    const result = [];
    files.forEach(file => {
        const filePath = path.join(configPath, `${file}.js`);
        if (fs.existsSync(filePath)) {
            result.push(importFile(filePath));
        }
    });
    return result;
};

export default extend(true, {}, defaults, ...getConfig('default', env, 'local'));
