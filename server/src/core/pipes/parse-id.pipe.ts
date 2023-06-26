import { BadRequestException, Injectable, Optional, PipeTransform } from '@nestjs/common';

import { Types, isValidObjectId } from 'mongoose';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  isOptional: boolean;

  constructor(@Optional() options?: { isOptional?: boolean }) {
    this.isOptional = options?.isOptional ?? false;
  }

  transform(value: any) {
    if (this.isOptional && value === undefined) {
      return undefined;
    } else if (!isValidObjectId(value)) {
      throw new BadRequestException('Value cannot be coerced to object ID: ' + value);
    }
    return new Types.ObjectId(value as string);
  }
}
