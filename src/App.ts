import * as express from 'express'
import {Express} from 'express'
import bodyParser from './middlewares/bodyParser'
import badRoute from "./middlewares/badRoute"
import errorExposer from "./middlewares/ErrorExposer"
import router from './routes'

declare global {
    namespace Express {
        interface Request {
            data: string
        }
    }
}

class App {
    public app: Express

    constructor() {
        this.app = express()
        this.loadBodyParser()
        this.loadRoutes()
    }

    private loadBodyParser() {
        bodyParser(this.app)
    }

    private loadRoutes() {
        this.app.use(router)
        badRoute(this.app)
        errorExposer(this.app)
    }
}

export default new App().app
