export default monking => async (ctx, next) => {
    let router = {};
    const matched = monking.routers.some(item => {
        if (item.method.toUpperCase() === ctx.method.toUpperCase() &&
            item.regexp.test(ctx.path)) {
            router = item;
            return true;
        }
        return false;
    });
    if (!matched) {
        monking.appLogger.error(`not matched '${ctx.path}' router`);
        await next();
        return;
    }
    const controller = new monking.controllers[router.controller]();
    const args = router.regexp.exec(ctx.path).slice(1).map(arg => arg === undefined ? arg : decodeURIComponent(arg));
    ctx.params = router.keys.reduce((params, key, index) => {
        params[key.name] = args[index];
        return params;
    }, {});
    ctx.$injector.register('query', ctx.query);
    ctx.$injector.register('params', ctx.params);
    ctx.$injector.register('render', router.viewHtml || '');
    await ctx.$injector.invoke(controller[router.action]);
    await next();
    const { responseHeader } = monking.config;
    ctx.response.set(Object.keys(responseHeader).reduce((pre, curr) => {
        if (responseHeader[curr].enable) {
            pre[curr] = responseHeader[curr].value;
        }
        return pre;
    }, {}));
};
