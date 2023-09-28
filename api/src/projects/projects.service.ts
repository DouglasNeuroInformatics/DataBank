import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectColumnDto } from './dto/project-column.dto.js';
import { Project, ProjectDocument } from './schemas/project.schema.js';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  // Create a new project
  createProject(createProjectDto: CreateProjectDto, ownerId: ObjectId): Promise<ProjectDocument> {
    return this.projectModel.create({ ...createProjectDto, owner: ownerId });
  }

  // Get a project by its ID
  async getById(projectID: string | ObjectId): Promise<ProjectDocument> {
    const foundProject = await this.projectModel.findById(projectID);
    if (!foundProject) {
      throw new NotFoundException();
    }
    //  populate method is used to populate reference fields in a document with the actual referenced documents
    await foundProject.populate('owner');
    return foundProject;
  }

  // Delete a project by its ID
  async deleteProject(projectID: ObjectId) {
    return this.projectModel.findByIdAndDelete(projectID);
  }

  // Update a project by its ID
  async updateColumn(projectID: ObjectId, updateProjectColumnDto: UpdateProjectColumnDto): Promise<ProjectDocument> {
    // we filter the by the projectID and update the project with the updateProjectColumnDto
    const foundProject = await this.projectModel.findByIdAndUpdate(projectID, updateProjectColumnDto);
    if (!foundProject) {
      throw new NotFoundException();
    } else {
      return foundProject;
    }
  }
}
