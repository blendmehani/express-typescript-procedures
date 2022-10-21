import UserService from "../services/UserService"
import {NextFunction, Request, Response} from "express"
import {NotFound, UnprocessableEntity} from 'http-errors'


class UserController {

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await UserService.signup(req.body)
            return res.json(result)
        } catch(err ) {
            return next(err)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const result = await UserService.login(req.body)
        if (result.error ===1)
            return next(new UnprocessableEntity(result.data))
        return res.json(result)
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        const result = await UserService.getUsers()
        return res.json(result)
    }

}

export default new UserController()