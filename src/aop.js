const aop = (filename) => (target, name, desc) => {
    const method = desc.value;
    desc.value = async function (...args) {
        const fn = this.context.app.aop[filename];
        const $injector = this.context.$injector;
        const aopFn = await $injector.invoke(fn);
        const data = await aopFn(method.bind(this, ...args));
        return data;
    };
    return desc;
};

const aopInject = (filename) => (target, name, desc) => {
    const method = desc.value;
    desc.value = async (monking, context) => {
        const fn = monking.aop[filename];
        const $injector = context.$injector;
        const aopFn = await $injector.invoke(fn);
        const data = await aopFn(method);
        return data;
    };
    return desc;
};

export {
    aop,
    aopInject
};
