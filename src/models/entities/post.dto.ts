import { IsString } from 'class-validator';

class CreatePostDTO {
    // @IsString()
    public authorId: string;
 
  	// @IsString()
   	public content: string;
 
 	//  @IsString()
  	 public title: string;
}

export default CreatePostDTO;