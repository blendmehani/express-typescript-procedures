import {Request, Response, Router} from 'express'
import UserController from "../controllers/UserController";
import bodyValidator from "../middlewares/bodyValidator";
import {CreateUserDto} from "../models/dtos/userDtos/CreateUserDto"
import {Route} from "./RoutesEnum"
import {LoginUserDto} from "../models/dtos/userDtos/LoginUserDto"
import {checkAuth} from "../middlewares/checkAuth";

const router = Router()

router.post(Route.SignUp, bodyValidator(CreateUserDto), UserController.signup)
router.post(Route.Login, bodyValidator(LoginUserDto), UserController.login)
router.get(Route.GetUsers, checkAuth, UserController.getUsers)

export default router