import App from './app';
import PostController from './posts/posts.controller';

const app = new App([new PostController()], 8800);
app.listen();