import path from 'path';
const apisdk = global.isDev ? path.join(process.cwd(), 'public', 'apisdk.js') : path.join(__dirname, 'apisdk.js');

const pluginConfigKey = {
  //  插件ID
  ID: 'id',
  //  插件版本
  VERSION: 'version',
  //  插件名称
  NAME: 'name',
  //  插件LOGO
  LOGO: 'logo',
  //  插件描述
  DESC: 'desc',
  //  插件logo文件路径
  LOGO_PATH: 'logoPath',
  //  插件主入口文件
  MAIN: 'main',
  //  插件是否多开
  MULTIPLE: 'multiple',
  //  插件开发模式配置
  DEV: 'dev',
  //  插件预加载文件
  PRELOAD: 'preload',
  //  插件配置文件地址
  JSON_PATH: 'jsonPath',
  //  插件配置文件所属文件夹地址
  FOLDER_PATH: 'folderPath',
  //  说明书路径
  README_PATH: 'readmePath',
  //  说明书内容
  README_CONTENT: 'readmeContent',
  //  自定义窗体配置
  WIN_OPTIONS: 'winOptions'
};

export { apisdk, pluginConfigKey };
