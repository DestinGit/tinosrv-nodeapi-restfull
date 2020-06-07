import * as express from 'express';
import Controller from "../../interfaces/icontroller";
import postModel from '../../models/posts.model';
import authMiddleware from '../../middleware/auth.middleware';
import RequestWithUser from '../../interfaces/irequestWithUser';
import { NextFunction } from 'express';
import NotAuthorizedException from '../../exceptions/NotAuthorizedException';

class UserController implements Controller{
    public path: String = '/users';
    public router: express.Router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}/:id/posts`, authMiddleware, () => {})
    }

    private getAllPostsOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const userId = request.params.id;
        if (userId === request.user._id.toString()) {
          const posts = await this.post.find({ author: userId });
          response.status(200).send(posts);
        }
        next(new NotAuthorizedException())        
    }
}

export default UserController;