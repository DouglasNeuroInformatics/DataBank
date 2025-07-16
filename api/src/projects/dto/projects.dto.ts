import { $CreateProject, $ProjectDataset, $UpdateProject } from '@databank/core';
import { DataTransferObject } from '@douglasneuroinformatics/libnest';

export class CreateProjectDto extends DataTransferObject($CreateProject) implements $CreateProject {}
export class ProjectDatasetDto extends DataTransferObject($ProjectDataset) implements $ProjectDataset {}
export class UpdateProjectDto extends DataTransferObject($UpdateProject) implements $UpdateProject {}
