# 面向切面编程

monking 引入了 java spring 的面向切面编程的思想 aop，并且也实现了依赖注入。需要 return function / async function，参数为 target，即为 controller 中 aop 修饰的类方法，该类方法执行之前或者之后可以做一些其他事情。根据不同正常情况，确定是否需要将target的结果返回。

由于 monking 的一个核心是[依赖注入](https://github.com/ssnau/injecting)，所以对于普通函数，提供了 aop 修饰器；对于依赖注入的类函数，提供了 aopInject 的修饰器。

aopInject 和 aop 不同的是，需要调用 context.$injector.invoke 方法来调用 target。

#### aop

修饰普通的类方法

```js
// server/aop/white.list.js
export default async (context, config, userModel, params) => {
    const whiteList = config.whiteList;
    const { name } = await userModel.getUserById(params.id);
    return (target) => {
        if (whiteList.include(name)) {
            return context.throw(400);
        }
        // do something
        const data = target();
        // do something
        return data;
    };
};

// server/model/reading/model.js
export default class Reading {
    constructor (monking) {
        this.Reading = monking.model.reading;
    }
    @aop('whiteList')
    async addReading (reading) {
        const readingModel = new this.Reading(reading);
        return await readingModel.save();
    }
}
```

#### aopInject

修饰依赖注入的类方法

```js
// server/aop/try.catch.js
export default (response, logger, context) => {
    return async (target) => {
        try {
            const data = await context.$injector.invoke(target);
            response(data);
        } catch (err) {
            logger.error(err);
            response(null, 500);
        }
    };
};

// server/controller/reading.js
export default class Reading {
    @Get('/api/reading/detail/:id')
    @aopInject('tryCatch')
    async getReadingDetailById (context, readingModel, params, user) {
        const readingInfo = await readingModel.increaseClickNumber(params.id, user.nickname);
        context.redirect(readingInfo.link);
    }
}
```

