import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import Controller from './interfaces/icontroller';

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach( controller => this.app.use('/', controller.router))    
    }

    private connectToTheDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Connected'))
        .catch((err) => console.error(err));
    }
    /**
     * listen
     */
    public listen() {
        this.app.listen(process.env.PORT, () => console.log(`App listening on the port ${process.env.PORT}`));       
    }

}

export default App;