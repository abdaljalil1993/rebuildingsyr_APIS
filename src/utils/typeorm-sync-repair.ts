import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";
import { env } from "../config/env";

interface MysqlErrorLike {
  code?: string;
  sql?: string;
}

const DROP_INDEX_REGEX = /DROP INDEX `([^`]+)` ON `([^`]+)`/i;
const DROP_FOREIGN_KEY_REGEX = /ALTER TABLE `([^`]+)` DROP FOREIGN KEY `([^`]+)`/i;

const REPAIRABLE_CODES = new Set([
  "ER_DROP_INDEX_FK",
  "ER_CANT_DROP_FIELD_OR_KEY"
]);

export const shouldAttemptSyncRepair = (error: unknown): boolean => {
  const mysqlError = error as MysqlErrorLike;
  return Boolean(mysqlError?.code && REPAIRABLE_CODES.has(mysqlError.code));
};

export const repairDropIndexForeignKeyConflict = async (
  error: unknown
): Promise<boolean> => {
  const mysqlError = error as MysqlErrorLike;

  if (!mysqlError?.sql) {
    return false;
  }

  const dropIndexMatch = mysqlError.sql.match(DROP_INDEX_REGEX);
  const dropFkMatch = mysqlError.sql.match(DROP_FOREIGN_KEY_REGEX);

  if (!dropIndexMatch && !dropFkMatch) {
    return false;
  }

  const operation = dropIndexMatch ? "DROP_INDEX" : "DROP_FOREIGN_KEY";
  const tableName = dropIndexMatch ? dropIndexMatch[2] : (dropFkMatch as RegExpMatchArray)[1];
  const keyName = dropIndexMatch ? dropIndexMatch[1] : (dropFkMatch as RegExpMatchArray)[2];

  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.username,
    password: env.db.password,
    database: env.db.database
  });

  try {
    const [constraints] = await connection.query<
      Array<RowDataPacket & { CONSTRAINT_NAME: string }>
    >(
      `
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME = ?
          AND CONSTRAINT_NAME = ?
          AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        LIMIT 1
      `,
      [env.db.database, tableName, keyName]
    );

    const [indexes] = await connection.query<
      Array<RowDataPacket & { INDEX_NAME: string }>
    >(
      `
        SELECT INDEX_NAME
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME = ?
          AND INDEX_NAME = ?
        LIMIT 1
      `,
      [env.db.database, tableName, keyName]
    );

    const fkExists = constraints.length > 0;
    const indexExists = indexes.length > 0;

    if (operation === "DROP_FOREIGN_KEY") {
      if (!fkExists) {
        return true;
      }

      await connection.query(
        `ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${keyName}\``
      );

      return true;
    }

    if (fkExists) {
      await connection.query(
        `ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${keyName}\``
      );
    }

    if (indexExists) {
      await connection.query(`DROP INDEX \`${keyName}\` ON \`${tableName}\``);
    }

    return true;
  } catch {
    return false;
  } finally {
    await connection.end();
  }
};