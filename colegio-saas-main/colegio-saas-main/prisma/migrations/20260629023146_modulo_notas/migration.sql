-- CreateTable
CREATE TABLE "Nota" (
    "id" SERIAL NOT NULL,
    "periodo" TEXT NOT NULL,
    "competencia" TEXT,
    "calificacion" DOUBLE PRECISION NOT NULL,
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "colegioId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nota_estudianteId_cursoId_periodo_key" ON "Nota"("estudianteId", "cursoId", "periodo");

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_colegioId_fkey" FOREIGN KEY ("colegioId") REFERENCES "Colegio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
