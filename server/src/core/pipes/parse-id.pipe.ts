import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { Types, isValidObjectId } from 'mongoose';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Value cannot be coerced to object ID: ' + value);
    }
    return new Types.ObjectId(value as string);
  }
}
