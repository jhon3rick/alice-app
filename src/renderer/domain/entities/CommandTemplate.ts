import { Project } from './Project';
import { Tag } from './Tag';

export interface CommandTemplate {
  id: number;
  codeindex: string;
  name: string;
  detail: string;
  resumen: string;
  steps: string[];
  projects: Project[];
  tags: Tag[];
}
