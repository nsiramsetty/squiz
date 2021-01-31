import * as mysql from 'mysql';
import config from '..';

export default class MySqlService {
  public static pool: mysql.Pool;

  public static getConnectionPool(): mysql.Pool {
    if (this.pool) {
      return this.pool;
    }
    const configProp = {
      ...config.search.mySqlConfig,
      user: process.env.MYSQL_DB_USER,
      host: process.env.MYSQL_DB_HOST,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_DATABASE,
    };
    this.pool = mysql.createPool(configProp);
    return this.pool;
  }
}
