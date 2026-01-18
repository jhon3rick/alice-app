import { CommandTemplate } from '../entities/CommandTemplate';
import { CreateCommandTemplateDTO, UpdateCommandTemplateDTO } from '../dtos/CommandTemplateDTO';

/**
 * Repository port for CommandTemplate
 * Defines the contract that any persistence adapter must implement
 */
export interface ICommandTemplateRepository {
  // Getters
  getAll(): Promise<CommandTemplate[]>;
  getById(id: number): Promise<CommandTemplate | null>;
  getByProjectId(projectId: number): Promise<CommandTemplate[]>;
  getByTagId(tagId: number): Promise<CommandTemplate[]>;
  search(query: string): Promise<CommandTemplate[]>;

  // Setters
  create(dto: CreateCommandTemplateDTO): Promise<CommandTemplate>;
  update(dto: UpdateCommandTemplateDTO): Promise<CommandTemplate>;
  delete(id: number): Promise<void>;
}
