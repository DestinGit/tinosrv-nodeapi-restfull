import * as express from 'express';
import Controller from "../../interfaces/icontroller";
import postModel from '../../models/posts.model';
import authMiddleware from '../../middleware/auth.middleware';
import RequestWithUser from '../../interfaces/irequestWithUser';
import { NextFunction } from 'express';

class UserController implements Controller{
    public path: String = '/users';
    public router: express.Router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        this.router.get(`${this.path}/:id/posts`, authMiddleware, () => {})
        // throw new Error("Method not implemented.");
    }

    private getAllPostsOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        // const userId = request.params.id;
        // if (userId === request.user._id.toString()) {
        //   const posts = await this.post.find({ author: userId });
        //   response.send(posts);
        // }        
    }

    
}