import * as express from 'express';
import Post from '../interfaces/ipost';
import Controller from '../interfaces/icontroller';
import postModel from '../models/posts.model';

class PostController implements Controller {
    public path: string = '/posts';
    public router = express.Router();

    private posts = postModel;

    constructor() {
        this.intializeRoutes();        
    }

    /**
     * intializeRoutes
     */
    public intializeRoutes() {
		this.router.get(this.path, this.getAllPosts);
		this.router.get(`${this.path}/:id`, this.getPostById);

		this.router.post(this.path, this.createPost);
		this.router.patch(`${this.path}/:id`, this.modifyPost);
		this.router.delete(`${this.path}/:id`, this.deletePost)
    }

    getAllPosts = (request: express.Request, response: express.Response) => {
        this.posts.find()
                    .then(posts => response.send(posts));
    }

	getPostById = (request: express.Request, response: express.Response) => {
		const id = request.params.id;
		this.posts.findById(id)
					.then(post => response.status(200).send(post))
	}

    createPost = (request: express.Request, response: express.Response) => {
        let postData: Post = request.body;
        const createPost = new this.posts(postData);

        createPost.save()
                    .then(savedPost => response.send(savedPost));
	}
	
	modifyPost = (request: express.Request, response: express.Response) => {
		const id = request.params.id;
		const postData = request.body;

		this.posts.findByIdAndUpdate(id, postData, {new : true})
					.then(post => response.status(200).send(post));
	}

	deletePost = (request: express.Request, response: express.Response) => {
		const id = request.params.id;

		this.posts.findByIdAndDelete(id)
					.then(success =>  {
						let statusVal = success ? 200 : 404;
						response.status(statusVal).send(success);
					});
	}
}

export default PostController;