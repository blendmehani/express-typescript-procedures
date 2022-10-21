import {verify} from "jsonwebtoken"

export const verifyToken = (token: string) => {
    const {APP_SECRET} = process.env
    return verify(token, APP_SECRET as string)
}