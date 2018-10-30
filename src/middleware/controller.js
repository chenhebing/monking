import path from 'path';
import fs from 'fs';

import { importFiles } from '../util';

export default monking => {
    monking.routers = monking.routers || [];
    const dir = path.resolve(monking.config.path.controllers);
    monking.controllers = importFiles(dir);
    const routerFileArr = [];
    const routerFilePath = `${monking.config.path.server}/routers`;
    Object.keys(monking.controllers).forEach(name => {
        const controller = new monking.controllers[name]();
        monking.routers.push(...((controller.__routers || []).map(item => {
            routerFileArr.push(`${item.method.padStart(6, ' ')}  ==>  ${item.path.padEnd(30, ' ')}  controller: ${name.padEnd(15, ' ')}${controller.__view && controller.__view[item.action] ? '  page: ' + controller.__view.pagePath[item.action] : ''}\n`);
            return Object.assign(item, {
                controller: name,
                viewHtml: controller.__view ? controller.__view[item.action] : null

            });
        })));
        routerFileArr.push('\n');
    });
    fs.writeFile(routerFilePath, routerFileArr.join(''), (err) => {
        if (err) {
            monking.appLogger.error(err);
        } else if (!monking.config.isProd) {
            monking.appLogger.info(`created router file at ${routerFilePath}`);
        }
    });
    return async (ctx, next) => {
        await next();
    };
};
