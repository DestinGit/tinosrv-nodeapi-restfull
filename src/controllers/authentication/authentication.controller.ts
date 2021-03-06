import Controller from '../../interfaces/icontroller';
import * as express from 'express';
import validationMiddleware from '../../middleware/validation.middleware';
import CreateUserDTO from '../../models/entities/user.dto';
import CreateLogInDTO from '../../models/entities/login.dto';
import userModel from '../../models/users.model';
import * as bcrypt from 'bcrypt';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';
import DataStoredInToken from '../../interfaces/idatastoredintoken';
import User from '../../interfaces/iuser';
import * as jwt from 'jsonwebtoken';
import TokenData from '../../interfaces/itokendata';

export default class AuthenticationController implements Controller{
    path: string = '/auth';
    router: express.Router = express.Router();
    private user = userModel;
    
    constructor() {
        this.initializeRoutes();    
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDTO), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(CreateLogInDTO), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
        // this.router.get(this.path, this.getAllUsers);
    }

    // private getAllUsers = (request: express.Request, response: express.Response) => {
    //     this.user.find().then(users => {
    //         response.status(200).send(users);
    //     })
    // }

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
            const tokenData = this.createToken(userDoc);
            res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            res.status(200).send(userDoc);
        }
    }

    private loggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const logInData: CreateLogInDTO = req.body;

        const userData = await this.user.findOne({email: logInData.email});
        if (userData) {
            // const hashedPwd = await bcrypt.hash(logInData.password, 10);
            const isPasswordMatching = await bcrypt.compare(logInData.password, userData.password);
            if (isPasswordMatching) {
                userData.password = undefined;
                const tokenData = this.createToken(userData);
                res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                res.status(200).send(userData);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    private loggingOut = (request: express.Request, response: express.Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.sendStatus(200);
    }

    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    
    private createToken(user: User) {
        const expiresIn = 60 * 60;
        const secret = process.env.JWT_SECRET;    
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn })
        }
    }

}
