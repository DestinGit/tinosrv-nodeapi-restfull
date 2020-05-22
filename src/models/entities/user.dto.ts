import { IsString } from 'class-validator';

class CreateUserDTO {
    // @IsString()
    public name: string;

    // @IsString()
    public email: string;

    // @IsString()
    public password: string;
}

export default CreateUserDTO;