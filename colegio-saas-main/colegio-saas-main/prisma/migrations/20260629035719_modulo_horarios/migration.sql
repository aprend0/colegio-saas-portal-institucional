-- CreateTable
CREATE TABLE "Horario" (
    "id" SERIAL NOT NULL,
    "dia" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "aula" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "colegioId" INTEGER NOT NULL,
    "seccionId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "docenteId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Horario_colegioId_idx" ON "Horario"("colegioId");

-- CreateIndex
CREATE INDEX "Horario_seccionId_idx" ON "Horario"("seccionId");

-- CreateIndex
CREATE INDEX "Horario_cursoId_idx" ON "Horario"("cursoId");

-- CreateIndex
CREATE INDEX "Horario_docenteId_idx" ON "Horario"("docenteId");

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_colegioId_fkey" FOREIGN KEY ("colegioId") REFERENCES "Colegio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
