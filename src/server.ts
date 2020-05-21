import 'dotenv/config';
import App from './app';
import PostController from './controllers/posts/posts.controller';
import validateEnv from './utils/validateEnv';
import AuthenticationController from './controllers/authentication/authentication.controller';

validateEnv();

const app = new App([new PostController(), new AuthenticationController()],);
app.listen();