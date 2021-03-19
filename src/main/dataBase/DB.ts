import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';

type QueryDB<T> = {
  [K in keyof T]?: T[K];
};

class DB<T = any> {
  _db: Datastore<Datastore.DataStoreOptions>;

  constructor(dbName: string) {
    this.init(dbName);
  }

  /**
   * 初始化
   * @param dbName
   */
  init(dbName: string): void {
    const dbPath =
      process.env.NODE_ENV === 'development'
        ? path.join(__dirname, `db/${dbName}.db`)
        : path.join(remote.app.getPath('userData'), `db/${dbName}.db`);

    const db = new Datastore({
      /**
       * autoload
       * default: false
       * 当数据存储被创建时，数据将自动从文件中加载到内存，不必去调用loadDatabase
       * 注意所有命令操作只有在数据加载完成后才会被执行
       */
      autoload: true,
      filename: dbPath,
      timestampData: true
    });

    this._db = db;
  }

  /**
   * 分页查找
   * @param param0
   * @returns
   */
  paging({ pageNum = 0, pageSize = 10 }: { pageNum: number; pageSize: number }): any {
    return new Promise(resolve => {
      this._db
        .find({})
        .sort({ createdAt: -1 })
        .skip(pageNum)
        .limit(pageSize)
        .exec(function(result) {
          resolve(result);
        });
    });
  }

  /**
   * 新增某项
   * @param doc
   * @returns
   */
  insert(doc: unknown): any {
    return new Promise((resolve: (value: any) => void) => {
      this._db.insert(doc, (error: Error | null, document: any) => {
        if (!error) {
          resolve(document);
        }
      });
    });
  }

  /**
   * 寻找某项
   * @param query
   * @returns
   */
  find(query: QueryDB<T>): any {
    return new Promise((resolve: (value: T[]) => void) => {
      this._db.find(query, (error: Error | null, document: T[]) => {
        if (!error) {
          resolve(document as T[]);
        }
      });
    });
  }

  /**
   * 寻找某一个项
   * @param query
   * @returns
   */
  findOne(query: QueryDB<T>): any {
    return new Promise((resolve: (value: T) => void) => {
      this._db.findOne(query, (error: Error | null, document) => {
        if (!error) {
          resolve(document as T);
        }
      });
    });
  }

  /**
   * 删除数据库项
   * @param query
   * @param options
   * @returns
   */
  remove(query: QueryDB<T>, options?: Nedb.RemoveOptions): any {
    return new Promise((resolve: (value: number) => void) => {
      if (options) {
        this._db.remove(query, options, (error: Error | null, n: number) => {
          if (!error) {
            resolve(n);
          }
        });
      } else {
        this._db.remove(query, (error: Error | null, n: number) => {
          if (!error) {
            resolve(n);
          }
        });
      }
    });
  }

  /**
   * 更新数据库项
   * @param query
   * @param updateQuery
   * @param options
   * @returns
   */
  update(query: unknown, updateQuery: unknown, options: Nedb.UpdateOptions = {}): any {
    return new Promise((resolve: (value: any) => void) => {
      this._db.update(
        query,
        updateQuery,
        options,
        (error: Error | null, numberOfUpdated: number, affectedDocuments: any) => {
          if (!error) {
            resolve(affectedDocuments);
          }
        }
      );
    });
  }
}

export default DB;
