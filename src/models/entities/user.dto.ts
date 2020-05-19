import { IsString } from 'class-validator';

class CreateUserDTO {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;
}

export default CreateUserDTO;