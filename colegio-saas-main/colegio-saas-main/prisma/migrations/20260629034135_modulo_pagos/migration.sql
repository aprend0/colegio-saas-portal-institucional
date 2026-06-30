-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "concepto" TEXT NOT NULL,
    "descripcion" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fechaVencimiento" TIMESTAMP(3),
    "fechaPago" TIMESTAMP(3),
    "metodoPago" TEXT,
    "comprobante" TEXT,
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "colegioId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pago_colegioId_idx" ON "Pago"("colegioId");

-- CreateIndex
CREATE INDEX "Pago_estudianteId_idx" ON "Pago"("estudianteId");

-- CreateIndex
CREATE INDEX "Pago_estado_idx" ON "Pago"("estado");

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_colegioId_fkey" FOREIGN KEY ("colegioId") REFERENCES "Colegio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
