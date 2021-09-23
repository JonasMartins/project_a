import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
class ProjectValidator {
  @Field()
  @IsString()
  public name: string;

  @Field()
  @IsString()
  public description: string;
}
export default ProjectValidator;
