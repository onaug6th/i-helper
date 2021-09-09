import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import compressing from 'compressing';

/**
 * 获取文件大小
 * @param filePath
 * @returns
 */
function getFileSize(filePath: string): Promise<number> {
  const reader = fs.createReadStream(filePath);

  return new Promise(resolve => {
    let len = 0;
    reader.on('data', function(chunk) {
      len += chunk.length;
    });

    reader.on('end', function() {
      resolve(len);
    });
  });
}

/**
 * 更新json文件内容
 * @param path
 * @param data
 * @returns
 */
function updateJson(path: string, data: { [propName: string]: any }): Promise<boolean> {
  return new Promise(resolve => {
    fs.readFile(path, 'utf8', function(err, text) {
      let result = JSON.parse(text);
      result = {
        ...result,
        ...data
      };

      //  为打包的插件信息写入插件ID
      fs.writeFile(path, JSON.stringify(result), 'utf8', function(err) {
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
 * 更新插件json
 * @param to
 * @param param0
 * @returns
 */
function updatePublishPluginJson(to: string, data: any) {
  if (!data || !Object.keys(data).length) {
    return;
  }

  return new Promise(resolve => {
    const afterJsonPath = path.join(to, 'plugin.json');
    fs.readFile(afterJsonPath, 'utf8', function(err, text) {
      let result = JSON.parse(text);
      result = {
        ...result,
        ...data
      };

      //  为打包的插件信息写入插件ID
      fs.writeFile(afterJsonPath, JSON.stringify(result), 'utf8', function(err) {
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
 * @param updateJsonData 内容更新配置
 */
async function buildDirTo({
  from,
  to,
  explorer = true,
  updateJsonData
}: {
  from: string;
  to: string;
  explorer?: boolean;
  updateJsonData?: any;
}): Promise<string> {
  //  打包后的压缩包路径
  const zipPath = `${to}.zip`;
  try {
    //  将插件文件拷到根目录压缩包文件夹
    await copy(from, to);

    //  存在内容复制后需要更新的配置
    if (updateJsonData) {
      await updatePublishPluginJson(to, updateJsonData);
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

  const paths = fs.readdirSync(fromPath);

  for (let i = 0; i < paths.length; i++) {
    const item = paths[i];
    const newFromPath = fromPath + '/' + item;
    const newToPath = path.resolve(toPath + '/' + item);

    const stat = fs.statSync(newFromPath);
    if (stat) {
      if (stat.isFile()) {
        copyFile(newFromPath, newToPath);
      }
      if (stat.isDirectory()) {
        await copy(newFromPath, newToPath);
      }
    }
  }
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

export { buildDirTo, copy, delDir, showInFolder, safeCreatedir, getFileSize, updateJson };
