import UserProcedures from "../models/procedures/UserProcedures"
import {CreateUserDto} from "@models/dtos/userDtos/CreateUserDto"
import * as bcrypt from 'bcrypt'
import {generateToken} from "../utils/generateToken";
import {TimeEnum} from "../utils/TimeEnum";
import {InternalServerError, UnprocessableEntity} from 'http-errors'

const generalResponse = (error: number, message: string | object= 'Something went wrong') => {
    let response
    switch(error) {
        case 0:
            response = {error: 0, data: message}
            break
        case 1:
            response = {error: 1, data: message}
    }
    return response
}

class UserService {

    constructor(private userProcedures = UserProcedures) {}


    async signup(createUserDto: CreateUserDto): Promise<any> {
        const {username, password} = createUserDto
        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await this.userProcedures.createUser(username, hashedPassword).catch(reason => {throw new InternalServerError()})

        if (result.is_error === 1)
            throw new UnprocessableEntity()

        return generalResponse(result.is_error, result.message)
    }


    async login(createUserDto: CreateUserDto): Promise<any> {
        const {username, password} = createUserDto

        const user = await this.userProcedures.login(username, password).catch(reason => {
            return generalResponse(1)
        })

        let isPasswordMatched: boolean = false

        if (user?.password) {
            isPasswordMatched = await bcrypt.compare(password, user.password)
        }

        if (user?.uuid && isPasswordMatched) {
            const token = generateToken(user.uuid, TimeEnum.DAY)
            return generalResponse(0, {message: 'You have logged in successfully!', token: token})
        }
        return generalResponse(1, 'Wrong credentials')
    }

    async getUsers() {
        return await this.userProcedures.getUsers().catch(reason => {
            return generalResponse(1)
        })
    }

}

export default new UserService()