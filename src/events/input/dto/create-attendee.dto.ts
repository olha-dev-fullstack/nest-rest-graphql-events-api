import { IsEnum } from 'class-validator';
import { AttendeeAnswerEnum } from 'src/events/attendee/attendee.entity';

export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
