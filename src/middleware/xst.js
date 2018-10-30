export default monking => async (ctx, next) => {
    if (monking.config.xst.includes(ctx.method.toLowerCase())) {
        ctx.throw(405);
    }
    await next();
};
