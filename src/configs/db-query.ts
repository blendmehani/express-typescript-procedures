import {pool} from "./db-connection"
import {OkPacket, ResultSetHeader, RowDataPacket} from "mysql2"
import {InternalServerError} from 'http-errors'

const isRowDataPacket = (rows: RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader): rows is RowDataPacket[] | RowDataPacket[][] => {
    return (rows as RowDataPacket[] | RowDataPacket[][]).length !== undefined
}

export default async (sql: string, params: (string | number | boolean)[] ) => {
    const [result,] = await pool.execute(sql, params)

    if(isRowDataPacket(result)){
        return result[0]
    }

    throw new InternalServerError('Something went wrong')
}
