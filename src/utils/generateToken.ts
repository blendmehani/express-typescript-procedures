import {sign} from "jsonwebtoken"
import {TimeEnum} from "./TimeEnum"

export function generateToken(data: string, time: TimeEnum) {
    const {APP_SECRET} = process.env
    return sign({uuid: data}, APP_SECRET as string, {expiresIn: time})
}