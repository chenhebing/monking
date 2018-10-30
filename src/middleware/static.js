import path from 'path';
import koaStatic from 'koa-static-cache';

export default (monking) => {
    const root = path.resolve(monking.config.path.public);
    const serverCache = monking.config.serverCache;
    return koaStatic(root, serverCache);
};
