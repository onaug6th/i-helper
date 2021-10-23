import fs from 'fs';
import merge from 'lodash/merge';
import path from 'path';

/**
 * 插件默认配置
 */
const DEFAULT_PLUGIN_CONFIG = {
  useScrollbarCSS: true,
  header: {
    show: true,
    title: true
  }
};

/**
 * 校验json文件是否合法
 */
function validPluginJSON(jsonPath: string | TPlugin): string | undefined {
  let file: TPlugin;
  if (typeof jsonPath === 'string') {
    file = getJSONFileData(jsonPath);
  } else {
    file = jsonPath;
  }

  const { main, name, logo, version } = file;
  let result: string;

  if (!main) {
    result = '没有指定入口文件（main）';
  }

  if (!name) {
    result = '没有指定插件名称（name）';
  }

  if (!logo) {
    result = '没有指定插件头像（logo）';
  }

  if (!version) {
    result = '没有指定版本号（version）';
  }

  return result;
}

/**
 * 根据json文件路径获取json数据
 * @param jsonPath
 * @returns
 */
function getJSONFileData(jsonPath: string): TPlugin {
  const text = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(text);
}

/**
 * 尝试获取readme内容
 */
function try2GetReadme(
  folderPath: string
): Promise<{
  path: string;
  content: string;
}> {
  return new Promise(resolve => {
    const readmePath = `${folderPath}README.md`;

    fs.access(readmePath, function(err) {
      const content = err ? '' : fs.readFileSync(readmePath, 'utf8');

      resolve({
        path: readmePath,
        content
      });
    });
  });
}

/**
 * 在不同平台下，设置不同的路径值
 * @param pathStr
 * @returns
 */
function checkPathStr(pathStr: string) {
  if (global.isMac) {
    return pathStr.replace(/\\/g, '/');
  } else if (global.isWindows) {
    return pathStr.replace(/\//g, '\\');
  }
}

/**
 * 补全对象的属性路径
 * @param obj
 * @param folderPath 文件目录路径
 */
function pathCompletion(obj: PluginDevConfig | TPlugin, folderPath: string): void {
  const { main, preload } = obj;

  //  入口文件，如不为 http 协议开头，补全文件夹目录加入口文件地址
  if (!main.startsWith('http')) {
    obj.main = path.join(folderPath, checkPathStr(main));
  }

  //  预加载js文件
  if (preload) {
    obj.preload = path.join(folderPath, checkPathStr(preload));
  }
}

/**
 * 根据文件路径获取插件信息，并补全插件的某些属性
 * @param jsonPath
 * @returns
 */
async function getPluginInfoByFile(jsonPath: string): Promise<{ error?: string; file?: TPlugin }> {
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
  const logo = file.logo;
  //  插件图标路径
  file.logoPath = path.join(folderPath, logo);
  //  补充协议
  file.logo = `atom:///${file.logoPath}`;

  //  补全路径
  pathCompletion(file, folderPath);
  //  存在开发者配置
  if (file.dev) {
    //  补全dev的路径
    pathCompletion(file.dev, folderPath);
  }

  //  json文件的路径
  file.jsonPath = jsonPath;
  //  文件夹路径（移除了最后的斜杠）
  file.folderPath = folderPath.slice(0, -1);

  //  补全插件说明路径
  const readmeInfo = await try2GetReadme(folderPath);
  file.readmePath = readmeInfo.path;
  file.readmeContent = readmeInfo.content;

  return { file: merge({}, DEFAULT_PLUGIN_CONFIG, file) };
}

export { getPluginInfoByFile };
