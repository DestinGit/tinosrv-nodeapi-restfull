import Controller from '../../interfaces/icontroller';
import * as express from 'express';
import validationMiddleware from '../../middleware/validation.middleware';
import CreateUserDTO from '../../models/entities/user.dto';
import CreateLogInDTO from '../../models/entities/login.dto';


export default class AuthenticationController implements Controller{
    path: String = '/auth';
    router: express.Router;

    constructor() {
        this.initializeRoutes();    
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDTO), this.registration);
        this.router.post(`${this.path}/login`,validationMiddleware(CreateLogInDTO), this.loggingIn)
    }

    private registration = (req: express.Request, res: express.Response, next: express.NextFunction) => {}

    private loggingIn = (req: express.Request, res: express.Response, next: express.NextFunction) => {}
}
