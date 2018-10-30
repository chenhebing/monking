import { importFiles } from '../util';

export default monking => {
    const path = monking.config.path.aop;
    monking.aop = importFiles(path);
    return async (ctx, next) => {
        await next();
    };
};
