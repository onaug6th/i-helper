/**
 * github：https://github.com/louischatriot/nedb
 * w3c api参考文档：https://www.w3cschool.cn/nedbintro/
 * nedb介绍：http://www.alloyteam.com/2016/03/node-embedded-database-nedb/
 */

import Datastore from 'nedb';
import path from 'path';

type QueryDB<T> = {
  [K in keyof T]?: T[K];
};

class DB<T = any> {
  //  数据库实例
  $db: Datastore<Datastore.DataStoreOptions>;

  constructor(dbName: string) {
    this.init(dbName);
  }

  /**
   * 数据库初始化
   * @param dbName
   */
  init(dbName: string): void {
    const dbPath = path.join(global.rootPath, `db/${dbName}.db`);

    //  https://www.w3cschool.cn/nedbintro/nedbintro-t9z327mh.html
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

    this.$db = db;
  }

  /**
   * 分页查找
   * https://github.com/louischatriot/nedb#sorting-and-paginating
   * @param param0
   * @returns
   */
  paging(query: { pageNum: number; pageSize: number; desc: boolean }): any {
    const { pageNum = 1, pageSize = 10, desc = true } = query || {};

    return new Promise(resolve => {
      this.$db
        .find({})
        .sort({
          createdAt: desc ? -1 : 1
        })
        .skip(pageNum * pageSize - pageSize)
        .limit(pageSize)
        .exec(function(err, result) {
          resolve(result);
        });
    });
  }

  /**
   * 新增某项
   * https://github.com/louischatriot/nedb#inserting-documents
   * @param doc
   * @returns
   */
  insert(doc: unknown): any {
    return new Promise((resolve: (value: any) => void) => {
      this.$db.insert(doc, (error: Error | null, document: any) => {
        if (!error) {
          resolve(document);
        }
      });
    });
  }

  /**
   * 寻找某项并排序
   * @param query
   * @param sort
   * @returns
   */
  find(query: QueryDB<T>, sort = { updatedAt: -1 }): any {
    return new Promise(resolve => {
      this.$db
        .find(query)
        .sort(sort)
        .exec((e, d) => {
          resolve(d);
        });
    });
  }

  /**
   * 寻找某一个项
   * https://github.com/louischatriot/nedb#finding-documents
   * @param query
   * @returns
   */
  findOne(query: QueryDB<T> = {}): any {
    return new Promise((resolve: (value: T) => void) => {
      this.$db.findOne(query, (error: Error | null, document) => {
        if (!error) {
          resolve(document as T);
        }
      });
    });
  }

  /**
   * 删除数据库项
   * https://github.com/louischatriot/nedb#removing-documents
   * @param query
   * @param options
   * @returns
   */
  remove(query: QueryDB<T>, options: Nedb.RemoveOptions = {}): any {
    return new Promise((resolve: (value: number) => void) => {
      this.$db.remove(query, options, (error: Error | null, n: number) => {
        if (!error) {
          resolve(n);
        }
      });
    });
  }

  /**
   * 更新数据库项
   * https://github.com/louischatriot/nedb#updating-documents
   * @param query
   * @param updateQuery
   * @param options
   * @returns
   */
  update(query: unknown, updateQuery: unknown, options: Nedb.UpdateOptions = {}): any {
    return new Promise((resolve: (value: any) => void) => {
      this.$db.update(
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
