import dbQuery from "../../configs/db-query"

class UserProcedures {

    constructor(private query = dbQuery) {}

    async createUser(username: string, password: string) {
        const result = await this.query('call create_user(?, ?)', [username, password])
        return result[0]
    }

    async login(username: string, password: string) {
        const result = await this.query('call login_user(?, ?)', [username, password])
        return result[0]
    }

    async getUsers() {
        const result = await this.query('call get_users()', [])
        return result
    }
}

export default new UserProcedures()