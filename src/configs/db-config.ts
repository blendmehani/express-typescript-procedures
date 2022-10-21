const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_WAIT_FOR_CONNECTIONS, DB_CONNECTION_LIMIT, DB_QUEUE_LIMIT, DB_PORT } = process.env

// const config = {
//     db: {
//         host: DB_HOST,
//         user: DB_USER,
//         port: DB_PORT,
//         password: DB_PASSWORD,
//         database: DB_NAME,
//         waitForConnections: DB_WAIT_FOR_CONNECTIONS,
//         connectionLimit: DB_CONNECTION_LIMIT,
//         queueLimit: DB_QUEUE_LIMIT,
//         dateStrings: true
//     }
// }
const config = {
    db: {
        host: DB_HOST as string,
        user: DB_USER as string,
        port: parseInt(DB_PORT as string),
        password: DB_PASSWORD as string,
        database: DB_NAME as string,
        waitForConnections: DB_WAIT_FOR_CONNECTIONS as unknown as boolean,
        connectionLimit: parseInt(DB_CONNECTION_LIMIT as string),
        queueLimit: parseInt(DB_QUEUE_LIMIT as string),
        dateStrings: true
    }
}

export default config