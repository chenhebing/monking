import chokidar from 'chokidar';
import chalk from 'chalk';
import { importFile, getCamelCaseFileName } from '../util';

export default monking => {
    const watcher = chokidar.watch(monking.config.path.server, {
        ignored: /[\/\\]node_modules[\/\\]/,  // eslint-disable-line
    });

    const reloadClient = () => {
        if (monking.wss) {
            // hack webpack-hot-client
            monking.wss.broadcast(JSON.stringify({
                type: 'window-reload'
            }));
        }
    };
    watcher.on('ready', () => {
        watcher.on('change', (path) => {
            // eslint-disable-next-line
            if (/[\/\\]server[\/\\]controller[\/\\]/.test(path)) {
                const dir = monking.config.path.controllers;
                const filename = getCamelCaseFileName(dir, path);
                const NewController = importFile(path, false);
                const controller = new NewController();
                monking.controllers[filename] = NewController;
                monking.routers = monking.routers.filter(route => route.controller !== filename);
                monking.routers.push(...((controller.__routers || []).map(item => Object.assign(item, {
                    controller: filename,
                    viewHtml: controller.__view ? controller.__view[item.action] : null
                }))));

                reloadClient();
                monking.appLogger.info(`${chalk.greenBright(path.replace(monking.config.path.server, ''))} ${chalk.green('had reload')}`);
            }

            // eslint-disable-next-line
            if (/[\/\\]server[\/\\]service[\/\\]/.test(path)) {
                const dir = monking.config.path.services;
                const filename = getCamelCaseFileName(dir, path);
                monking.services[filename] = importFile(path, false);
                // hack webpack-hot-client
                reloadClient();
                monking.appLogger.info(`${chalk.greenBright(path.replace(monking.config.path.server, ''))} ${chalk.green('had reload')}`);
            }
            // eslint-disable-next-line
            if (/[\/\\]server[\/\\]model[\/\\].+model\.js$/.test(path)) {
                const dir = monking.config.path.models;
                const filename = getCamelCaseFileName(dir, path);
                monking.modelServices[filename] = importFile(path, false);
                // hack webpack-hot-client
                reloadClient();
                monking.appLogger.info(`${chalk.greenBright(path.replace(monking.config.path.server, ''))} ${chalk.green('had reload')}`);
            }
            // eslint-disable-next-line
            if (/[\/\\]server[\/\\]aop[\/\\]/.test(path)) {
                const dir = monking.config.path.aop;
                const filename = getCamelCaseFileName(dir, path);
                monking.aop[filename] = importFile(path, false);
                // hack webpack-hot-client
                reloadClient();
                monking.appLogger.info(`${chalk.greenBright(path.replace(monking.config.path.aop, ''))} ${chalk.green('had reload')}`);
            }
        });
    });
    return async (ctx, next) => {
        await next();
    };
};
