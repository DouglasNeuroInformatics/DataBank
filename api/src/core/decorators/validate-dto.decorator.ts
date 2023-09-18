import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsNotEmptyObject, ValidateNested } from "class-validator";

export function ValidateDto(dto: any) {
    return applyDecorators(
        IsNotEmptyObject(),
        ValidateNested(),
        Type(() => dto)
    );
}