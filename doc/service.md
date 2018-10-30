# service

service 是复杂业务场景下对业务逻辑的解耦和抽象，这样做有以下好处：

* 使 controller 中的逻辑更加简洁
* 保持业务逻辑的独立性，一个 service 可以被多个 controller 调用

### 编写 service

monking 对 service 做了[依赖注入](https://github.com/ssnau/injecting)。依赖注入的实现，依赖于文件名，规则为：

将 service 文件夹下面的文件名转换成驼峰式变量，作为依赖注入的参数名。例如：

* /server/service/ua.js => ua
* /server/service/ua-ios.js => uaIos
* /server/service/ua.ios.js => uaIos
* /server/service/ua_ios.js => uaIos
* /server/service/ua/ios.js => uaIos

service 可以使用两种方式写

```js
// function 方式
// /server/service/ua.js

export default (headers) => {
    const userAgent = headers['user-agent'] || '';
    const isIPhone = () => /iPhone/.test(userAgent);
    const isAndroid = () => /Android/.test(userAgent);
    return {
        isIPhone,
        isAndroid
    };
};

// class 方式
// /server/service/device.js
export default class Device {
    constructor(ua) {
        this.ua = ua;
    }
    getOs() {
        return this.ua.isIPhone ? 'ios' : 'android';
    }
};

// /server/service/xxx.js
export default (device) => {
    return device.getOs();
};
```

### 内置服务

可以直接在 service、controller、aop 和 model 中直接使用。

服务 | 描述 | 使用举例
---- | ---- | ----
monking | 框架实体对象 | 略
context | 中间件请求上下文 | 略
headers | 请求头 | 略
config | 配置信息 | config.isProd
query | 查询参数 | query.id
params | restful 路由中的参数 | params.id
logger | log4js 的日志 | logger.info('test')
render | 模板渲染器 | render({title: 'test'})
body   | 请求体 | 略
helper | 常用方法集成 | 见下

helper 服务提供了以下方法：
* helper.escape 直接引自 [escape-html](https://github.com/component/escape-html)

* helper.safeRedirect 替代 ctx.redirect 的安全跳转方法，跳转是推荐使用。config 中可以配置跳转白名单。

* helper.isEmptyObject 验证是否是空对象

* helper.isEmptyArr 验证是否是空数组

* helper.isEmptyString 验证是否是空字符串

* helper.validateNotEmpty 验证是否为空值
