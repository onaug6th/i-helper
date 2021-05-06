# i-helper
A desktop assistant

##  plugin插件相关

### 插件打开

在插件打开时，调用 windowManage.createPluginBrowserWindow 创建窗体 `pluginWindow`

新建 sessionItem , `session.fromPartition(plugin.name)`

设置 sessionItem 的预加载文件，`sessionItem.setPreloads(文件路径)`

创建 `BrowserView` 实例 `browserViewItem`，并将 sessionItem 赋给 `browserViewItem` 的 session 属性

挂载 `browserViewItem` 到 `pluginWindow`，`pluginWindow.setBrowserView(browserViewItem)`

### 插件方法

在插件打开时，记录插件的窗体id及窗体id所属插件信息。

`createBrowserWindow(url: string, option: BrowserWindowConstructorOptions)`

插件窗口调用 `iHelper.createBrowserWindow` 时，在 `plugin.service.ts` 中能够得知调用的窗体id及其余参数。

`plugin.service.ts` 根据调用窗体ID来确认调用方法的插件名称，然后再新增窗体到窗体集合中。

