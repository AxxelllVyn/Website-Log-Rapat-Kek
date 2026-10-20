import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Menyinkronkan kategori naskah rapat di database...');

  const categoryMap: Record<string, string[]> = {
    DISPOSISI_Setjen: ['MTG-004', 'MTG-005', 'MTG-006', 'MTG-007', 'MTG-015', 'MTG-017'],
    NASKAH_MASUK: ['MTG-002', 'MTG-003', 'MTG-013', 'MTG-014'],
    DISPOSISI_BIRO: ['MTG-009', 'MTG-010', 'MTG-018'],
    SURAT_DITUNDA: ['MTG-023'],
  };

  for (const [category, ids] of Object.entries(categoryMap)) {
    const res = await prisma.meeting.updateMany({
      where: { id: { in: ids } },
      data: { documentCategory: category },
    });
    console.log(`- ${category}: ${res.count} rapat diperbarui`);
  }

  // Sisa meeting tetap UNDANGAN_INTERNAL
  const allUpdated = Object.values(categoryMap).flat();
  const internalCount = await prisma.meeting.count({
    where: { id: { notIn: allUpdated } },
  });
  console.log(`- UNDANGAN_INTERNAL: ${internalCount} rapat`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
