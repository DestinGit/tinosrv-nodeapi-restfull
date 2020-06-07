import HttpException from "./HttpException";

class NotAuthorizedException extends HttpException {
    constructor() {
        super(400, 'Not Authorized');
    }
}

export default NotAuthorizedException;