export interface CreateCommandTemplateDTO {
  name: string;
  detail: string;
  resumen: string;
  steps: string;
  projectIds: number[];
  tagIds: number[];
}

export interface UpdateCommandTemplateDTO extends Partial<CreateCommandTemplateDTO> {
  id: number;
}
