import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Menyiapkan akun Pimpinan di database...');
  const defaultPasswordHash = await bcrypt.hash('DevOnly!2026', 10);

  // Cari biro UK atau default pertama
  const biro = await prisma.biro.findFirst({
    where: { code: 'UK' },
  }) || await prisma.biro.findFirst();

  if (!biro) {
    throw new Error('Tidak ada biro ditemukan di database!');
  }

  const user = await prisma.user.upsert({
    where: { email: 'pimpinan@simrapat.local' },
    update: {
      name: 'Dr. H. Bambang Soeprapto (Pimpinan Dewan KEK)',
      role: UserRole.PIMPINAN,
      biroId: biro.id,
      password: defaultPasswordHash,
      isActive: true,
    },
    create: {
      name: 'Dr. H. Bambang Soeprapto (Pimpinan Dewan KEK)',
      email: 'pimpinan@simrapat.local',
      role: UserRole.PIMPINAN,
      biroId: biro.id,
      password: defaultPasswordHash,
      isActive: true,
    },
  });

  console.log('✅ Akun Pimpinan berhasil dibuat/diperbarui:');
  console.log(`- Nama: ${user.name}`);
  console.log(`- Email: ${user.email}`);
  console.log(`- Peran: ${user.role}`);
  console.log(`- Password: DevOnly!2026`);
}

main()
  .catch((e) => {
    console.error('❌ Gagal menyiapkan akun pimpinan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
