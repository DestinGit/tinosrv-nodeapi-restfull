import { IsString } from 'class-validator';

export default class CreateLogInDTO {
    // @IsString()
    public email: string;

    // @IsString()
    public password: string;
}