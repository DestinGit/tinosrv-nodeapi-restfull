import Controller from '../../interfaces/icontroller';
import * as express from 'express';
import validationMiddleware from '../../middleware/validation.middleware';
import Post from '../../interfaces/ipost';
import postModel from '../../models/posts.model';
import PostNotfoundException from '../../exceptions/PostNotFoundException';
import CreatePostDTO from '../../models/entities/post.dto';

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

		this.router.post(this.path, validationMiddleware(CreatePostDTO), this.createPost);
		this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDTO, true), this.modifyPost);
		this.router.delete(`${this.path}/:id`, this.deletePost)
    }

    getAllPosts = (request: express.Request, response: express.Response) => {
        this.posts.find()
                    .then(posts => response.send(posts));
    }

	getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		this.posts.findById(id)
					.then(post => {
						if (post) {
							response.status(200).send(post);
						} else {
							// next(new HttpException(404, 'Post not found'));
							next(new PostNotfoundException(id));
						}
					})
	}

    createPost = (request: express.Request, response: express.Response) => {
        let postData: Post = request.body;
        const createPost = new this.posts(postData);

        createPost.save()
                    .then(savedPost => response.send(savedPost));
	}
	
	modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		const postData = request.body;

		this.posts.findByIdAndUpdate(id, postData, {new : true})
					.then(post => {
						if (post) response.status(200).send(post);
						else next(new PostNotfoundException(id));
					});
	}

	deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;

		this.posts.findByIdAndDelete(id)
					.then(success =>  {
						if (success) {
							response.status(200).send(success);
						} else {
							next(new PostNotfoundException(id));
						}
					});
	}
}

export default PostController;