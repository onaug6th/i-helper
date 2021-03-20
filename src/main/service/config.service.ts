//  应用配置数据库
import configDB from '@/main/dataBase/config.db';

/**
 * 获取配置
 * @param type
 * @returns { Promise }
 */
async function getConfig(type: string): Promise<any> {
  return new Promise(resolve => {
    const sql: { type?: any } = {};
    if (type) {
      sql.type = type;
    }
    configDB._db.find(sql).exec((e, d) => {
      resolve(d);
    });
  });
}

export { getConfig };
