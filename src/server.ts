import 'dotenv/config';
import App from './app';
import PostController from './controllers/posts/posts.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new PostController()],);
app.listen();