import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import compressing from 'compressing';

/**
 * 亚索文件夹到指定目录（没错，就是亚索）
 * @param from 从哪来
 * @param to 想去哪
 * @param explorer 是否在资源管理目录中查看
 */
async function buildDirTo(from: string, to: string, explorer = true): Promise<string> {
  //  打包后的压缩包路径
  const zipPath = `${to}.zip`;
  try {
    //  将插件文件拷到根目录压缩包文件夹
    await copy(from, to);

    await compressing.zip.compressDir(to, zipPath);

    if (explorer) {
      exec(`explorer.exe /select,${zipPath}`);
    }

    delDir(to);
  } catch (error) {
    throw new Error('打包失败');
  }
  return zipPath;
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
 * 复制文件夹
 * @param fromPath
 * @param toPath
 * @returns
 */
async function copy(fromPath: string, toPath: string): Promise<any> {
  return new Promise(resolve => {
    fs.access(toPath, function(err) {
      if (err) {
        fs.mkdirSync(toPath, { recursive: true });
      }
    });

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

export { buildDirTo, copy, delDir };
