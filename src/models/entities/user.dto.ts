import { IsString, IsObject } from 'class-validator';

class CreateUserDTO {
    // @IsString()
    public name: string;

    // @IsString()
    public email: string;

    // @IsString()
    public password: string;
    
    // @IsObject()
    public address: object
}

export default CreateUserDTO;