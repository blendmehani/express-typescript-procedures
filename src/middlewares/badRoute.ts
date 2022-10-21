import {Express, NextFunction, Response, Request} from "express";
import {NotFound} from 'http-errors'

export default (app: Express) => {

    app.use((req: Request, res: Response, next: NextFunction): void => {
        throw new NotFound('This route does not exist')
    })

}