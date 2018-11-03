# config

monking config 是为解决多环境问题而存在的配置文件，这里设计了三种层面的配置文件。

monking 已经包含了一些框架必须的配置，通过修改各个环境的配置文件，可以覆盖默认配置。具体请参考 [config](../src/config.js)。

除了之外，monkig-react-render 还提供了一些config，可以参考 [monking-reactrender](https://github.com/chenhebing/monking-react-render)。

### 目录结构

<pre>
config
├── default.js
├── development.js
├── test.js
├── production.js
├── local.js
</pre>
1. ##### config/default.js
    服务的默认配置，和环境无关

2. ##### config/[development | test | production].js
    对于不同环境，monking 会加载其对应的配置文件。development 是公共的开发环境的配置，test 是测试环境的配置，production 是线上环境的配置。

3. ##### config/local
    可能有人会比较奇怪为啥会有 local 的配置，local 也是本地开发环境的配置，与 development 不同的是，你可以在这里配置一些你自己独有的配置，这些配置不会 push 到远端仓库，从而也不会影响其他开发者的环境配置。

### 加载顺序及合并规则

monking 按照1，2，3的顺序加载，后面的会对前面的配置合并。合并使用了 extend2 进行深度拷贝，只是处理数组采用了直接覆盖同名配置的方式实现。

### 使用

monking 将 config 进行了注入，我们可以在 controller、service、aop等多个地方直接使用，具体请参考 [service](./service.md)。
