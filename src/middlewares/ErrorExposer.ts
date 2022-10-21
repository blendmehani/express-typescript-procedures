import {Express, NextFunction, Response, Request} from "express"

export default (app: Express) => {
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500)

        if(err.status === undefined || err.status === 500) {
            return res.json({
                status: 500,
                message: 'Something went wrong'
            })
        }

        return res.json({
            status: err.status || 500,
            message: err.message || 'Something went wrong'
        })
    })
}

