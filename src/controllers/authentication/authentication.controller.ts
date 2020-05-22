import Controller from '../../interfaces/icontroller';
import * as express from 'express';
import validationMiddleware from '../../middleware/validation.middleware';
import CreateUserDTO from '../../models/entities/user.dto';
import CreateLogInDTO from '../../models/entities/login.dto';
import userModel from '../../models/users.model';
import * as bcrypt from 'bcrypt';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';

export default class AuthenticationController implements Controller{
    path: string = '/auth';
    router: express.Router = express.Router();
    private user = userModel;
    
    constructor() {
        this.initializeRoutes();    
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDTO), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(CreateLogInDTO), this.loggingIn)
    }

    private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDTO = req.body;

        const userExist = await this.user.findOne({email: userData.email})
        if (userExist) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            const hashedPwd = await bcrypt.hash(userData.password, 10);
            const userDoc = await this.user.create({
                ...userData,
                password: hashedPwd
            });

            userDoc.password = undefined;
            res.status(200).send(userDoc);
        }
    }

    private loggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const logInData: CreateLogInDTO = req.body;

        const userData = await this.user.findOne({email: logInData.email});
        if (userData) {
            const hashedPwd = await bcrypt.hash(logInData.password, 10);
            const doPasswordsMatch = await bcrypt.compare(logInData.password, userData.password);
            if (doPasswordsMatch) {
                userData.password = undefined;
                res.status(200).send(userData);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }
}
