import path from 'path';
import fs from 'fs';
import koaCompose from 'koa-compose';

import { importFile } from './util';

export default monking => {
    const coreMiddlewarePath = path.resolve(__dirname, './middleware');
    const userMiddlewarePath = path.resolve(monking.config.path.middlewares);
    const files = [];
    const middleWareConfig = [];
    middleWareConfig.push('logger', 'static', 'bodyParser', 'service', 'aop', 'controller',
        ...(monking.config.middlewares || []),
        ...(monking.config.env === 'development' ? ['serverHmr'] : []),
        'router');
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
            console.error(`load ${middlewareFile} middleware faild, please check the name.`);
            return;
        }
        files.push(file);
    });
    return koaCompose(Array.prototype.concat.apply([], files.map(file => file(monking))));
};
