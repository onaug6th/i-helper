//  插件窗体项
interface PluginWinItem {
  //  窗体ID
  id: number;
  //  视图ID
  viewId: number;
  //  插件ID
  pluginId: string;
  //  窗体实例
  win: Electron.BrowserWindow;
  //  窗体加载的地址
  url: string;
  //  窗体加载的视图地址
  viewUrl: string;
  //  是否开发者模式的插件
  isDev?: boolean;
  //  窗体的父窗体id
  fatherId?: number | null;
  //  父窗体的视图ID
  fatherViewId?: number | null;
}

//  插件窗体集合
interface PluginWinItems {
  [propName: number]: PluginWinItem;
}

//  视图项
interface ViewWin {
  //  所属窗体ID
  pluginWinId: number;
  //  所属插件ID
  pluginId: string;
  //  view实例
  viewItem: Electron.BrowserView;
}

//  视图项集合
interface ViewWins {
  //  视图ID：窗体ID
  [propName: number]: ViewWin;
}

interface PluginDevConfig {
  main: string;
  preload?: string;
}

interface PluginWinOptions {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
}

interface PluginPermissions {
  /**
   * 剪贴板
   */
  clipboard: boolean;
}

interface PluginHeader {
  show?: boolean;
  title?: boolean;
  btns?: Array<string>;
}

interface Plugin {
  /**
   * ID
   */
  id: string;
  /**
   * 版本号
   */
  version: string;
  /**
   * 名称
   */
  name: string;
  /**
   * LOGO
   */
  logo: string;
  /**
   * 描述
   */
  desc: string;
  /**
   * 主入口文件
   */
  main: string;

  /**
   * 开发模式配置
   */
  dev?: PluginDevConfig;
  /**
   * 是否多开
   */
  multiple?: boolean;
  /**
   * 预加载文件
   */
  preload?: string;
  /**
   * 是否使用默认滚动条样式
   */
  useScrollbarCSS?: boolean;
  /**
   * 头部栏配置
   */
  header?: PluginHeader;
  //  主窗体关闭时，是否回收所有子窗体
  closeGCChilds?: boolean;
  /**
   * 窗体配置
   */
  winOptions?: PluginWinOptions;
  /**
   * 权限配置
   */
  permissions?: PluginPermissions;

  /**
   * 图标补全地址
   */
  logoPath?: string;
  /**
   * json文件补全地址
   */
  jsonPath?: string;
  /**
   * 插件文件夹补全地址
   */
  folderPath?: string;
  /**
   * readme补全地址
   */
  readmePath?: string;
  /**
   * readme内容
   */
  readmeContent?: string;

  /**
   * 是否允许更新
   */
  canUpdate?: boolean;
  /**
   * 审核状态
   */
  reviewStatus?: number;
  /**
   * 审核内容
   */
  reviewContent?: string;
}

interface StorePlugin {
  /**
   * ID
   */
  id: string;
  /**
   * 版本号
   */
  version: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 描述
   */
  desc: string;
  /**
   * readme内容
   */
  readmeContent: string;
  /**
   * 压缩包地址
   */
  fileUrl: string;
  /**
   * 作者ID
   */
  authorId: string;
  /**
   * logo地址
   */
  logo: string;
  /**
   * 压缩包大小（字节）
   */
  size: number;
  /**
   * 压缩包大小（格式化后的字符串）
   */
  sizeFormat: string;

  /**
   * 是否允许更新
   */
  canUpdate?: boolean;
  /**
   * 是否已下载
   */
  isDownload?: boolean;
}
