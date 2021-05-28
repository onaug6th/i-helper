import fs from 'fs';
import path from 'path';

/**
 * 复制文件
 * @param from
 * @param to
 */
function copyFile(from, to) {
  fs.copyFileSync(from, to);
}

/**
 * 复制文件夹
 * @param fromPath
 * @param toPath
 * @returns
 */
export async function copy(fromPath: string, toPath: string): Promise<any> {
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
export function delDir(path: string): void {
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
