import { Controller, Get } from '@nestjs/common';

import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  hello() {
    return this.projectsService.hello();
  }
}
