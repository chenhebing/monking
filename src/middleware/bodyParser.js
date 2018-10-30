import bodyParser from 'koa-bodyparser';

export default monking => {
    const bodyDisableMiddleware = async (ctx, next) => {
        if (monking.config.bodyParserDisable.includes(ctx.method.toLowerCase())) {
            ctx.disableBodyParser = true;
        }
        await next();
    };
    const bodyParserMiddleware = bodyParser(monking.config.bodyParser || {});
    return [bodyDisableMiddleware, bodyParserMiddleware];
};
