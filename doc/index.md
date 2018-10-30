### 目录结构

使用 monking，需要按照如下约定创建目录，也可以使用提供的脚手架 [monking-cli](https://github.com/chenhebing/monking-cli) 直接生成模板。

<pre>

├── client
│   ├── asset       // 用于放置一些必须的静态资源文件
│   ├── component   // 前端公共组件，强业务组件推荐和页面放在一起
│   ├── page        // 用于放置页面，约定需要一个页面名称的文件夹，下面包含 index.js 作为入口文件
│   └── style       // 公共样式文件夹
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
│   └── template    // 渲染模板，模板名称可以在 config 中配置
│       └── layout.html
├── index.js

</pre>

### 更多

- [配置文件 config](./config.md)
- [client 端](./client.md)
- server 端
    - [控制器 -- controller](./controller.md)
    - [中间件 -- middleware](./middleware.md)
    - [服务 -- service](./service.md)
    - [面向切面编程 -- aop](./aop.md)
    - [渲染模板 -- template](./template.md)