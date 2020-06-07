import * as express from 'express';
import Controller from "../../interfaces/icontroller";
import postModel from '../../models/posts.model';
import authMiddleware from '../../middleware/auth.middleware';
import RequestWithUser from '../../interfaces/irequestWithUser';
import { NextFunction } from 'express';
import NotAuthorizedException from '../../exceptions/NotAuthorizedException';
import userModel from '../../models/users.model';
import UserNotFoundException from '../../exceptions/UserNotFoundException';

class UserController implements Controller{
    public path: String = '/users';
    public router: express.Router = express.Router();
    private post = postModel;
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}/:id`, authMiddleware, () => {});
        this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
    }

    private getUserById = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const userQuery = this.user.findById(id);
        if (request.query.withPosts === 'true') {
            userQuery.populate('posts').exec();
        }
        const user = await userQuery;

        if (user) {
            response.status(200).send(user);
        } else {
            next(new UserNotFoundException(id));
        }
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