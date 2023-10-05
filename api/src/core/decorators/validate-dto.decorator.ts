import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsNotEmptyObject, ValidateNested } from "class-validator";
import type { Class } from "type-fest";

// const animal = {
//     name: 'Winston'
// }

// type AnimalClass = Class<typeof animal>
export function ValidateDto<T extends object>(dto: Class<T>) {
    return applyDecorators(
        IsNotEmptyObject(),
        ValidateNested(),
        Type(() => dto)
    );
}