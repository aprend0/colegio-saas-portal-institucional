const bcrypt = require('bcrypt');
const { PrismaClient } = require('.prisma/client');

// Script para crear el primer Super Admin en la base de datos
const prisma = new PrismaClient();

async function main() {
  // Encriptar la contraseña antes de guardarla
  const hash = await bcrypt.hash('Admin123!', 10);

  // Crear el Super Admin en la base de datos
  const superAdmin = await prisma.superAdmin.create({
    data: {
      email: 'admin@colegio.com',
      password: hash,
    },
  });

  console.log('Super Admin creado exitosamente:', superAdmin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());