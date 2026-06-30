-- AlterTable
ALTER TABLE "Colegio" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "slogan" TEXT,
ADD COLUMN     "telefono" TEXT,
ADD COLUMN     "ugel" TEXT,
ALTER COLUMN "colorPrimario" SET DEFAULT '#92462F',
ALTER COLUMN "colorSecundario" SET DEFAULT '#BA9E7E';
