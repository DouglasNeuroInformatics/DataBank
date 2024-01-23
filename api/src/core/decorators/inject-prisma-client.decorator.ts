import { Inject } from "@nestjs/common";

export const InjectPrismaClient = () => {
    return Inject('prisma');
};