import path from 'path';
import fs from 'fs';
import koaCompose from 'koa-compose';

import { importFile } from './util';

export default async monking => {
    const coreMiddlewarePath = path.resolve(__dirname, './middleware');
    const userMiddlewarePath = path.resolve(monking.config.path.middlewares);
    const files = [];
    const middleWareConfig = ['logger',
        ...(!monking.config.onlyServer ? ['static'] : []),
        'bodyParser', 'service', 'aop', 'controller',
        ...(monking.config.middlewares || []),
        ...(monking.config.env === 'development' ? ['serverHmr'] : []),
        'router'];
    middleWareConfig.forEach(middlewareFile => {
        let file;
        if (fs.existsSync(path.join(coreMiddlewarePath, `${middlewareFile}.js`))) {
            file = importFile(path.join(coreMiddlewarePath, middlewareFile));
        } else if (fs.existsSync(path.join(userMiddlewarePath, `${middlewareFile}.js`))) {
            file = importFile(path.join(userMiddlewarePath, middlewareFile));
        } else {
            file = importFile(middlewareFile);
        }
        if (!file) {
            monking.appLogger.error(`load ${middlewareFile} middleware faild, please check the name.`);
            return;
        }
        files.push(file);
    });
    const composeFile = await Promise.all(files.map(async file => {
        try {
            return await file(monking);
        } catch (err) {
            monking.appLogger.error('async load middleware fail: ', err);
        }
    }));
    return koaCompose(Array.prototype.concat.apply([], composeFile));
};
