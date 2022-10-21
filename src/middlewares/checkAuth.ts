import {NextFunction, Request, Response} from "express"
import {verifyToken} from "../utils/verifyToken"
import {JwtPayload} from "jsonwebtoken"
import {Unauthorized} from 'http-errors'


export const checkAuth = (req:Request, res:Response, next: NextFunction) => {

    try {

        let token: string = ''

        if(req.headers.authorization)
            token = req.headers.authorization.split(' ')[1]

        const data: JwtPayload = verifyToken(token) as JwtPayload

        if (data) {
            req.data = data['uuid']
        }

        return next()

    } catch(err) {
        throw new Unauthorized()
        // return res.status(401).json({message: 'Not authorized'})
    }
}