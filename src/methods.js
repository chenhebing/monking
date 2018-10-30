import pathToRegexp from 'path-to-regexp';

const decoratorFactory = (method, path) => (controller, action) => {
    controller.__routers = controller.__routers || [];
    const pathType = Object.prototype.toString.call(path);
    if (pathType === '[object Array]') {
        controller.__routers.push(...path.map(item => {
            const keys = [];
            const regexp = pathToRegexp(item, keys);
            return {
                method,
                action,
                path: item,
                regexp,
                keys
            };
        }));
    } else if (pathType === '[object String]') {
        const keys = [];
        const regexp = pathToRegexp(path, keys);
        controller.__routers.push({
            method,
            action,
            path,
            regexp,
            keys
        });
    }
};

export const Get = (path) => {
    return decoratorFactory('get', path);
};

export const Post = (path) => {
    return decoratorFactory('post', path);
};

export const Put = (path) => {
    return decoratorFactory('put', path);
};

export const Delete = (path) => {
    return decoratorFactory('delete', path);
};
