import HttpException from "./HttpException";

class AuthenticationTokenMissingException extends HttpException {
    constructor() {
        super(400, 'AuthenticationToken Missing');
    }
}

export default AuthenticationTokenMissingException;