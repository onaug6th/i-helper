# APIDoc

##  app（应用相关）

### getWinInfo()

获取当前窗体的信息
* 返回：
```ts
interface WinInfo {
  pluginId: string;
  viewId: number;
  fatherViewId: number;
  isDev: boolean;
}
```

### createBrowserWindow(url, options)

创建一个新插件窗体
* 参数：
1. `{string} url`
2. `{BrowserWindowConstructorOptions} options`

* 返回：{number} viewId 新窗体的ID

如果重复打开相同`url`的窗体，iHelper会重新将相同`url`的窗体显示出来，而不是重新创建一个窗体。

如需要打开相同`url`但多个窗体，可以设置`options`的`newInstance`属性值为true。来打开新的窗体

### send(id, event)

往指定id窗体发送事件
* 参数：
1. `{number} id`
2. `{string} event`

调用此方法能够往目标id的窗体发送事件

```js
iHelper.send(窗体ID, 'note-add');
```

### on(event, cb)

监听窗体事件
* 参数：
1. `{string} event`
2. `{Function} cb`

调用此方法能够监听其他窗体往本窗体发送的事件，并执行回调;

```js
iHelper.on('note-add', () => {
  //  do sth...
});
```

### close()

关闭当前窗体

如当前窗体为插件父窗体，则会回收通过此窗体打开的子插件窗体


##  db（数据库相关）

### db.paging

### db.insert

### db.find

### db.findAndSort

### db.findOne

### db.remove

### db.update
