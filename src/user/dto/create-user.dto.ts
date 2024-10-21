import { IsEmail, Length } from 'class-validator';
import { UserDoesNotExist } from 'src/auth/validation/user-does-not-exist.contraint';
import { IsRepeated } from 'src/validation/is-repeated.constraints';

export class CreateUserDto {
  @Length(5)
  @UserDoesNotExist()
  username: string;

  @Length(8)
  password: string;

  @Length(8)
  @IsRepeated('password')
  retypedPassword: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;

  @IsEmail()
  @UserDoesNotExist()
  email: string;
}
