import fastifyMultipart from '@fastify/multipart';
import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { FastifyInstance } from 'fastify';

@Injectable()
export class FastifyMultipartInitializer implements OnModuleInit {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  async onModuleInit() {
    const instance = this.adapterHost.httpAdapter.getInstance<FastifyInstance>();
    await instance.register(fastifyMultipart);
  }
}
