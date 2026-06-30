-- CreateTable
CREATE TABLE "Galeria" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "categoria" TEXT,
    "colegioId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Galeria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Galeria" ADD CONSTRAINT "Galeria_colegioId_fkey" FOREIGN KEY ("colegioId") REFERENCES "Colegio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
