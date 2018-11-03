### 目录结构

使用 monking，需要按照如下约定创建目录，也可以使用提供的脚手架 [monking-cli](https://github.com/chenhebing/monking-cli) 直接生成模板。

<pre>

├── config          // 各个环境的配置文件
│   ├── default.js
│   ├── development.js
│   ├── local.js
│   ├── production.js
│   └── test.js
├── server
│   ├── aop         // 提供面向切面编程的入口
│   ├── controller  // 用于处理请求，然后返回处理的结果
│   ├── middleware  // 中间件，加载顺序可以在 config 里面进行配置
│   ├── model       // 数据库持久化层，所有 model 做了依赖注入，用户可以直接调用。目前只支持 mongodb
│   ├── routers     // 自动生成全部的路由信息，供开发查看路由，排查问题。
│   ├── service     // 业务逻辑层，解耦业务逻辑，所有 service 做了依赖注入，方便用户直接调用
├── index.js

</pre>

### 更多

- [配置文件 config](./config.md)
- server 端
    - [控制器 -- controller](./controller.md)
    - [中间件 -- middleware](./middleware.md)
    - [服务 -- service](./service.md)
    - [面向切面编程 -- aop](./aop.md)