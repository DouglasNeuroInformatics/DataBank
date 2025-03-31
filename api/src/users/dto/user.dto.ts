import { $CreateUser } from '@databank/core';
import type { CreateUser } from '@databank/core';
import { DataTransferObject } from '@douglasneuroinformatics/libnest';

export class CreateUserDto extends DataTransferObject($CreateUser) implements CreateUser {}
