import { $CreateProject, $ProjectDataset, $UpdateProject } from '@databank/core';
import type { CreateProject, ProjectDataset, UpdateProject } from '@databank/core';
import { DataTransferObject } from '@douglasneuroinformatics/libnest';

class CreateProjectDto extends DataTransferObject($CreateProject) implements CreateProject {}

class UpdateProjectDto extends DataTransferObject($UpdateProject) implements UpdateProject {}

class ProjectDatasetDto extends DataTransferObject($ProjectDataset) implements ProjectDataset {}

export { CreateProjectDto, ProjectDatasetDto, UpdateProjectDto };
