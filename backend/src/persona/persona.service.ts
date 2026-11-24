import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto.js';
import { UpdatePersonaDto } from './dto/update-persona.dto.js';
import { Persona } from './entities/persona.entity.js';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personas: Repository<Persona>,
  ) {}

  create(dto: CreatePersonaDto): Promise<Persona> {
    return this.personas.save(this.personas.create(dto));
  }

  findAll(): Promise<Persona[]> {
    return this.personas.find({ order: { apellidos: 'ASC', nombres: 'ASC' } });
  }

  async findOne(id: string): Promise<Persona> {
    const persona = await this.personas.findOneBy({ id_persona: id });
    if (!persona) {
      throw new NotFoundException(`No existe la persona ${id}`);
    }
    return persona;
  }

  async update(id: string, dto: UpdatePersonaDto): Promise<Persona> {
    const persona = await this.findOne(id);
    Object.assign(persona, dto);
    return this.personas.save(persona);
  }

  async remove(id: string): Promise<void> {
    const result = await this.personas.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`No existe la persona ${id}`);
    }
  }
}
