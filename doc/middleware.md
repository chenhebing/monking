# middleware

monking 的设计理念是一切皆为中间件，与 koa2 的中间件稍有区别，monking 的中间件是以 monking 为参数，返回 koa2 中间件的函数，接下来先看个例子：

```js
import path from 'path';
import koaStatic from 'koa-static';

export default (monking) => {
    const root = path.resolve(monking.config.path.public);
    const serverCache = monking.config.serverCache;
    return koaStatic(root, serverCache);
};

```
monking 继承自 koa2，并且在其上面挂载了 config，我们可以直接使用这些对象，最后 return 真正的 koa2 middleware 即可。我们假定 return 之前的代码为预备程序，那么相当于将框架的启动服务拆分到了各个 monking 中间件来管理，解耦了各个模块的依赖，又通过 monking 将各个模块连接起来，方便于管理。

除了上面例子中直接 return 一个 koa2 的中间件外，我们也设计了可以 return 包含 koa2 中间件的数组，这样就可以将相关联的中间件放在一起管理。例如：

```js
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
```

### 核心 middleware

monking 内置了一些中间件，使用者不用关心其配置。

##### logger

通过 [log4js](https://github.com/log4js-node/log4js-node) 实现，在 [config](./config/md) 中对 log4js 进行配置，默认的配置是开发环境日志会打到终端，线上环境打到对应的文件中，使用 pm2 来启动和管理项目。

##### static

通过 [koa-static](https://github.com/koajs/static) 实现，config 中配置缓存策略。

##### bodyParser

用于解析 body，[config](./config/md) 中配置了不解析 body 的请求。

##### service

加载 server 端的 [service](./service.md)，进行依赖注入，供 controller， aop 等直接调用。

##### aop

加载 server 端的 [aop](./aop.md)。

##### controller

加载 server 端的 [controller](./controller.md)。

##### router

匹配路由，执行相应的 controller。

### 可选 middleware

monking 提供了一些可选的 middleware，使用者需要在 config 中的 middleware 中配置，配置的顺序即为执行的顺序。

##### mongodb

使用 [mongoose](http://mongoosejs.com/) 实现 server 端数据持久化功能。我们提供的该中间件，会将 model 做依赖注入，但是考虑到 mongoose 需要提起定义 schema 和 生成单例的 model，于是我们约定，index.js 根据schema 生成 model，生成的 model 会挂载在 monking.model 上面，model.js 来做增删改查的操作。

```js
// server/model/user/index.js

export default ({createSchema, createModel, Schema}) => {
    const schema = createSchema({
        name: String,
        age: String
    });

    return createModel('user', schema);
};
```
这里的 createSchema 和 createModel 只是对 new mongoose.Schema 和 mongoose.model 进行了封装，Schema 为 mongoose.Schema 用于创建 Schema 特有的数据类型。

```js
// server/model/user/model.js

export default class UserModel {
    constructor (context, monking, logger) {
        this.context = context;
        this.userModel = monking.model.user;
        this.logger = logger;
    }
    async getUserById (id) {
        const user = await this.userModel.findById(id).exec();
        return user;
    }
};

```
monking 将 context、monking 和logger 做了依赖注入，mongodb 中间件将 userModel 做了依赖注入，依赖注入规则，具体请参考 [service](./service.md)。

在 [config](./config.md) 中需对 mongodb 进行配置，并且可以设置 defaultSchema，createSchema 时会合并 defaultSchema。

##### session

用于管理session，基于 [koa-session](https://github.com/koajs/session) 实现，需要在 config 中对 session 做必要的配置。

##### csrf

CSRF（Cross-site request forgery，跨站请求伪造）会对网站发起恶意伪造的请求，严重影响网站的安全。

该中间件基于 [Koa CSRF](https://github.com/koajs/csrf) 实现，用于防范 CSRF，需要在 config 中做必要的配置。

##### xst

XST 的全称是 Cross-Site Tracing，客户端发 TRACE 请求至服务器，如果服务器按照标准实现了 TRACE 响应，则在 response body 里会返回此次请求的完整头信息。通过这种方式，客户端可以获取某些敏感的头字段，例如 httpOnly 的 Cookie。

如果使用该中间件，monking config 中的 xst 的默认配置禁掉了 trace、track 和 options 请求，如需修改，可通过重新配置覆盖默认配置。


