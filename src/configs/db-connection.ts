import * as mysql from 'mysql2/promise'
import config from "./db-config"

export const pool = mysql.createPool(config.db)

