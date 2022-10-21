import {RequestHandler, Request, Response, NextFunction} from 'express'
import {plainToInstance} from 'class-transformer'
import {validate} from "class-validator"
import * as sanitizeHtml  from 'sanitize-html'

const bodyValidator = (dto: any): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {

        for(let value in req.body) {
            if(req.body.hasOwnProperty(value))
                req.body[value] = sanitizeHtml(req.body[value])
        }

        const dtoObject = plainToInstance(dto, req.body)

        // sanitize(dtoObject)
        // for (const [key, value] of Object.entries(dtoObject)) {
        //     if (typeof(value) === 'string')
        //         req.body[key] = value.trim();
        // }

        const validated = await validate(dtoObject)

        let errorParams: { [x: string]: { [type: string]: string; } | undefined; }[] = []

        validated.forEach(error => {
            let property = error.property
            errorParams.push({[property]: error.constraints})
        })

        if(validated.length)
            return res.status(422).json({errors: errorParams})

        req.body = dtoObject
        return next()

    }
}

export default bodyValidator