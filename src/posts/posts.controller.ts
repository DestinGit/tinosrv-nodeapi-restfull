import * as express from 'express';
import Post from '../interfaces/ipost';
import Controller from '../interfaces/icontroller';

class PostController implements Controller {
    public path: string = '/posts';
    public router = express.Router();

    private posts: Post[] = [{
        author: 'Marcin',
        content: 'Dolor sit amet',
        title: 'Lorem Ipsum',
    }];

    constructor() {
        this.intializeRoutes();        
    }

    /**
     * intializeRoutes
     */
    public intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.post(this.path, this.createPost);
    }

    getAllPosts = (request: express.Request, response: express.Response) => {
        response.send(this.posts);
    }

    createPost = (request: express.Request, response: express.Response) => {
        let post: Post = request.body;
        this.posts.push(post);
        response.send(post);
    }
}

export default PostController;