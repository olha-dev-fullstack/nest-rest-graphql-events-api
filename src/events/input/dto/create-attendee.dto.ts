import { IsEnum } from 'class-validator';
import { AttendeeAnswerEnum } from '../../../events/attendee/attendee.entity';

export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
