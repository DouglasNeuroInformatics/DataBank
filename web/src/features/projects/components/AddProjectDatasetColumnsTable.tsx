// TData, BOOLEAN
type ProjectDatasetColumnInfo = {
  columnName: string;
  description?: string;
  nullable: boolean;
};

type ProjectDatasetStringColumn = ProjectDatasetColumnInfo & {
  kind: 'STRING';
};

type ProjectDatasetIntColumn = ProjectDatasetColumnInfo & {
  intSummary: {
    max: number;
    mean: number;
    median: number;
    min: number;
    mode: number;
    std: number;
  };
  kind: 'INT';
};

type ProjectDatasetFloatColumn = ProjectDatasetColumnInfo & {
  floatSummary: {
    max: number;
    mean: number;
    median: number;
    min: number;
    std: number;
  };
  kind: 'FLOAT';
};

type ProjectDatasetEnumColumn = ProjectDatasetColumnInfo & {
  enumSummary: {
    distribution: string;
  };
  kind: 'ENUM';
};

type ProjectDatasetDatetimeColumn = ProjectDatasetColumnInfo & {
  datetimeSummary: {
    max: Date;
    min: Date;
  };
  kind: 'DATETIME';
};

export type ProjectDatasetColumn =
  | ProjectDatasetDatetimeColumn
  | ProjectDatasetEnumColumn
  | ProjectDatasetFloatColumn
  | ProjectDatasetIntColumn
  | ProjectDatasetStringColumn;

export const myColumn: ProjectDatasetColumn = {
  columnName: 'mycol',
  intSummary: {
    max: 5,
    mean: 3,
    median: 4,
    min: 1,
    mode: 6,
    std: 2.5
  },
  kind: 'INT',
  nullable: false
};
