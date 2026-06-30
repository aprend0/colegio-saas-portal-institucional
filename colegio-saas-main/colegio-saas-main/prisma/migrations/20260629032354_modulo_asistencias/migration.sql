-- CreateTable
CREATE TABLE "Asistencia" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PRESENTE',
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "colegioId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "seccionId" INTEGER,
    "cursoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Asistencia_colegioId_idx" ON "Asistencia"("colegioId");

-- CreateIndex
CREATE INDEX "Asistencia_estudianteId_idx" ON "Asistencia"("estudianteId");

-- CreateIndex
CREATE INDEX "Asistencia_seccionId_idx" ON "Asistencia"("seccionId");

-- CreateIndex
CREATE INDEX "Asistencia_cursoId_idx" ON "Asistencia"("cursoId");

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_colegioId_fkey" FOREIGN KEY ("colegioId") REFERENCES "Colegio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
