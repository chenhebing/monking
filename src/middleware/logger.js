import koaLogger from 'koa-logger';
import log4js from 'log4js';

export default monking => {
    log4js.configure(monking.config.log4js);
    monking.logger = log4js.getLogger('context');
    monking.appLogger = log4js.getLogger('app');
    return koaLogger((str, args) => {
        const out = monking.config.isProd ? args.slice(1).join(' ') : str;
        if (args[3] && args[3] > 400) {
            monking.appLogger.error(out);
        } else {
            monking.appLogger.info(out);
        }
    });
};
