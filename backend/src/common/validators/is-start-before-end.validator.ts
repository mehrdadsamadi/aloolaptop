import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isStartBeforeEnd', async: false })
export class IsStartBeforeEnd implements ValidatorConstraintInterface {
  validate(startDate: string, args: ValidationArguments) {
    const obj = args.object as any;
    if (!startDate || !obj.endDate) return true; // اجازه میده بقیه قوانین بررسی شوند
    return new Date(startDate) < new Date(obj.endDate);
  }

  defaultMessage(args: ValidationArguments) {
    return 'startDate باید قبل از endDate باشد';
  }
}
