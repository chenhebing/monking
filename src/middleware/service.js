import path from 'path';
import injecting from 'injecting';

import { importFiles } from '../util';

export default monking => {
    const serviceDir = path.resolve(monking.config.path.services);
    const coreServer = path.resolve(__dirname, '../service');
    monking.services = Object.assign(importFiles(serviceDir), importFiles(coreServer));
    return async (ctx, next) => {
        ctx.$injector = injecting();
        ctx.$injector.register('context', ctx);
        ctx.$injector.register('headers', ctx.headers);
        ctx.$injector.register('body', ctx.request.body);
        ctx.$injector.register('monking', monking);
        ctx.$injector.register('config', monking.config);
        ctx.$injector.register('logger', monking.logger);
        Object.keys(monking.services).forEach(name => {
            ctx.$injector.register(name, monking.services[name]);
        });
        await next();
        ctx.$injector = null;
        delete ctx.$injector;
    };
};
