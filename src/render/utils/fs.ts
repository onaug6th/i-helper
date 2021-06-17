import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import compressing from 'compressing';

/**
 * 更新插件json
 * @param to
 * @param param0
 * @returns
 */
function updatePluginJson(to: string, { jsonPath, data }: { jsonPath: string; data: any }) {
  return new Promise(resolve => {
    const afterJsonPath = `${to}\\plugin.json`;
    fs.readFile(jsonPath, 'utf8', function(err, text) {
      const config = JSON.parse(text);
      config.id = data.id;

      //  为打包的插件信息写入插件ID
      fs.writeFile(afterJsonPath, JSON.stringify(config), 'utf8', function(err) {
        if (err) {
          throw new Error(err.message);
        } else {
          resolve(true);
        }
      });
    });
  });
}

/**
 * 亚索插件文件夹到指定目录（没错，就是亚索）
 * @param from 从哪来
 * @param to 想去哪
 * @param explorer 是否在资源管理目录中查看
 * @param updateConfig 内容更新配置
 */
async function buildDirTo({
  from,
  to,
  explorer = true,
  updateConfig
}: {
  from: string;
  to: string;
  explorer?: boolean;
  updateConfig?: {
    jsonPath: string;
    data: any;
  };
}): Promise<string> {
  //  打包后的压缩包路径
  const zipPath = `${to}.zip`;
  try {
    //  将插件文件拷到根目录压缩包文件夹
    await copy(from, to);

    //  存在内容复制后需要更新的配置
    if (updateConfig) {
      await updatePluginJson(to, updateConfig);
    }

    await compressing.zip.compressDir(to, zipPath);

    if (explorer) {
      showInFolder(zipPath);
    }

    delDir(to);
  } catch (error) {
    throw new Error('打包失败');
  }
  return zipPath;
}

/**
 * 在文件夹中查看
 * @param path
 */
function showInFolder(path: string): void {
  exec(`explorer.exe /select,${path}`);
}

/**
 * 复制文件
 * @param from
 * @param to
 */
function copyFile(from: string, to: string) {
  fs.copyFileSync(from, to);
}

/**
 * 安全的创建文件夹
 * @param path
 */
function safeCreatedir(path: string): Promise<void> {
  return new Promise(resolve => {
    fs.access(path, function(err) {
      if (err) {
        fs.mkdirSync(path, { recursive: true });
      }
      resolve();
    });
  });
}

/**
 * 复制文件夹
 * @param fromPath
 * @param toPath
 * @returns
 */
async function copy(fromPath: string, toPath: string): Promise<any> {
  //  安全的创建文件夹
  await safeCreatedir(toPath);

  return new Promise(resolve => {
    fs.readdir(fromPath, function(err, paths) {
      if (err) {
        console.log(err);
        return;
      }
      paths.forEach(function(item) {
        const newFromPath = fromPath + '/' + item;
        const newToPath = path.resolve(toPath + '/' + item);

        fs.stat(newFromPath, async function(err, stat) {
          if (err) {
            return;
          }
          if (stat.isFile()) {
            copyFile(newFromPath, newToPath);
          }
          if (stat.isDirectory()) {
            await copy(newFromPath, newToPath);
          }
        });
        resolve(true);
      });
    });
  });
}

/**
 * 删除目录
 * @param path
 */
function delDir(path: string): void {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(file => {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        //  递归删除文件夹
        delDir(curPath);
      } else {
        //  删除文件
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

export { buildDirTo, copy, delDir, showInFolder, safeCreatedir };
