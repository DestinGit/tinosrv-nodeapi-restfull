import { IsString } from 'class-validator';

export default class CreateLogInDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;
}