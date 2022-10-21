import * as express from 'express'
import {Express} from "express";

export default (app: Express): void => {
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
}