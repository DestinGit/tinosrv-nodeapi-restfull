import HttpException from "./HttpException";

export default class WrongCredentialsException extends HttpException {
    constructor() {
        super(400, 'Wrong Credentials');
    }
}