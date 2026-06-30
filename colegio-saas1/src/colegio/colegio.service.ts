import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateColegioDto } from './dto/update-colegio.dto';

@Injectable()
export class ColegioService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.colegio.findMany({
      include: { admin: true },
    });
  }

  findOne(id: number) {
    return this.prisma.colegio.findUnique({
      where: { id },
    });
  }

  create(data: any) {
    return this.prisma.colegio.create({ data });
  }

  update(id: number, dto: UpdateColegioDto) {
    return this.prisma.colegio.update({
      where: { id },
      data: dto,
    });
  }

  async toggleEstado(id: number) {
    const c = await this.prisma.colegio.findUnique({ where: { id } });
    if (!c) throw new Error('Colegio no encontrado');
    return this.prisma.colegio.update({
      where: { id },
      data: { activo: !c.activo },
    });
  }
}
