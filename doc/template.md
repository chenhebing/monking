# template

用于存放 html 的渲染模板，可以根据不同的场景来对模板进行修改，在 config 中可以配置模板的名字。

monking 对模板使用了 handlebar 来做预渲染，可以在 controller 中将数据 render 到模板文件中。

目前只支持 react 的，其他前端框架也类似，大同小异。后面会逐步支持其他框架的渲染。

### 例子

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>{{title}}</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
</head>
<body>
    <div id="app">{{{outlet}}}</div>
    <script>
        window.__INITIAL_STATE__ = {{{$initState}}};
        window.onload = function () {
            var app = document.querySelector('#app');
            ReactDOM.hydrate(React.createElement(APP.default, window.__INITIAL_STATE__), app);
        };
    </script>
</body>
</html>
```