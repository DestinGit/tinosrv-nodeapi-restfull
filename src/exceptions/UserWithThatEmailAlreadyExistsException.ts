import HttpException from "./HttpException";

export default class UserWithThatEmailAlreadyExistsException extends HttpException {
    constructor(email) {
        super(400, `User with email : ${email} alreay exist`);
    }
}