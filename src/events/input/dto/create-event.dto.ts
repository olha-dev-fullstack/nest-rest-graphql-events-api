import { IsDateString, Length } from 'class-validator';

export class CreateEventDto {
  @Length(5, 255, { message: 'Wrong name length' })
  name: string;
  @Length(5, 255)
  description: string;
  @IsDateString()
  when: string;
  @Length(5, 255)
  address: string;
}
