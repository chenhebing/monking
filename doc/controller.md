# controlller

controller 层主要负责对用户请求参数进行处理，然后调用相应的 service 方法处理业务，得到业务结果后封装并返回。

### 编写 controller

约定使用类方法的方式编写

```js
// 为了举例 model 的依赖注入，正常开发，model 应该放在 service中，controller 尽量不做业务处理

import { Get, aopInject } from 'monking';
import { view } from 'monking-react-render';

export default class Home {
    @Get('/home')
    @view('/home')
    @aopInject('whiteList')
    async index (context, render, userModel, params) {
        const user = await userModel.getUserById(params.id);
        render({
            title: 'monking',
            user
        });
    }
};
```

monking 和 monking-react-render 集成了 Get，Post，Put、Delete、view、aop 等修饰器，用来修饰类方法，方便解耦 controller。

* Get、Post、Put、Delete

    http 请求方法，参数为请求的 path

* view
    渲染前端模板的文件路径，参数为 client/page 下文件的 path

* aop
    server 端 [aop](./aop.md) 方法的调用，参数为 server/aop 下 文件的 path

类方法的参数依赖注入了 service、model 等，其中 render 方法可以将服务端预取的数据传给渲染模板。一般 view 和 render 一起使用，对于 api 接口，不需要使用 view 和 render。

