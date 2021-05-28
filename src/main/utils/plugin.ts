import fs from 'fs';
//  插件属性名称常量
import { pluginConfigKey } from '@/main/config/browserWindow';

/**
 * 校验json文件是否合法
 */
function validPluginJSON(jsonPath: string | any): string | undefined {
  let file;
  if (typeof jsonPath === 'string') {
    file = getJSONFileData(jsonPath);
  } else {
    file = jsonPath;
  }

  const main = file[pluginConfigKey.MAIN];
  const name = file[pluginConfigKey.NAME];
  let result: string;

  if (main) {
    if (!/\.html$/i.test(main)) {
      result = '入口文件不是HTML文件（main）';
    }
  } else {
    result = '没有指定入口文件（main）';
  }

  if (!name) {
    result = '没有指定插件名称（name）';
  }
  return result;
}

/**
 * 根据json文件路径获取json数据
 * @param jsonPath
 * @returns
 */
function getJSONFileData(jsonPath: string): any {
  const text = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(text);
}

/**
 * 补全对象的属性路径
 * @param obj
 * @param folderPath 文件目录路径
 */
function pathCompletion(obj: any, folderPath: string): void {
  const main = obj[pluginConfigKey.MAIN];
  const preload = obj[pluginConfigKey.PRELOAD];

  //  入口文件，如不为 http 协议开头，补全文件夹目录加入口文件地址
  if (!main.startsWith('http')) {
    obj[pluginConfigKey.MAIN] = `${folderPath}${main}`;
  }

  //  预加载js文件
  if (preload) {
    obj[pluginConfigKey.PRELOAD] = `${folderPath}${preload}`;
  }
}

/**
 * 根据文件路径获取插件信息
 * @param jsonPath
 * @returns
 */
function getPluginInfoByFile(jsonPath: string): { error?: string; file?: any } {
  const file = getJSONFileData(jsonPath);
  const error = validPluginJSON(file);

  if (error) {
    return {
      error
    };
  }

  //  文件夹路径
  const folderPath = jsonPath.replace('plugin.json', '');
  //  图标
  const logo = file[pluginConfigKey.LOGO];
  //  补全插件图标路径
  file[pluginConfigKey.LOGO] = `atom:///${folderPath}${logo}`;

  //  补全路径
  pathCompletion(file, folderPath);
  //  存在开发者配置
  if (file[pluginConfigKey.DEV]) {
    //  补全dev的路径
    pathCompletion(file[pluginConfigKey.DEV], folderPath);
  }

  //  json文件的路径
  file[pluginConfigKey.JSON_PATH] = jsonPath;
  //  文件夹路径（移除了最后的斜杠）
  file[pluginConfigKey.FOLDER_PATH] = folderPath.slice(0, -1);
  file[pluginConfigKey.FOLDER_NAME] = file[pluginConfigKey.FOLDER_PATH].split('\\').pop();

  return { file };
}

export { getPluginInfoByFile };
