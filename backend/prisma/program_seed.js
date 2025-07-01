const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// seed untuk pembuatan program
// async function main() {
//   await prisma.program.createMany({
//     data: [
//       {
//         id: '961e73e0-f728-4fd1-852c-d48734bc57e0',
//         name: 'Legacy Project',
//         start_date: new Date('2025-01-30T00:00:00Z'),
//         end_date: new Date('2025-05-30T00:00:00Z'),
//         description: 'Legacy Project adalah Program Pendampingan...',
//         creator_id: 2,
//         price: 150000,
//         image_banner:
//           'https://admin.program.taktix.co.id/images/lcWWjuaKIFeBQL4SAULxxoyhOwjG8sncDHQh0Yi3.png',
//         is_enrolled: false,
//         created_at: new Date('2023-06-14T05:33:21Z'),
//         updated_at: new Date('2025-01-17T14:34:31Z'),
//         status_id: 9001,
//         matter_id: 4,
//         with_passing_grade: true,
//       },
//       {
//         id: '44c0e324-55a6-4b56-a1ef-a1ddffaf309e',
//         name: 'Sanedu',
//         start_date: new Date('2024-08-09T00:00:00Z'),
//         end_date: new Date('2025-08-10T00:00:00Z'),
//         description: '',
//         creator_id: 2,
//         price: 0,
//         image_banner:
//           'https://fakeimg.pl/600x400/005bb0/ffff00?text=TAKTIX&font=bebas',
//         is_enrolled: false,
//         created_at: new Date('2024-08-03T08:33:56Z'),
//         updated_at: new Date('2024-11-20T16:31:58Z'),
//         status_id: 9001,
//         matter_id: 4,
//         with_passing_grade: true,
//       },
//     ],
//   });
// }

// seed untuk pembuatan agenda program
async function main() {
  // Cari program yang sudah ada (gantilah dengan ID program yang valid)
  const programId = '44c0e324-55a6-4b56-a1ef-a1ddffaf309e';

  await prisma.agendaProgram.createMany({
    data: [
      {
        id: '06d9cb5e-74d3-4942-a285-87a7ba77c2a3',
        program_id: programId,
        agenda: 'Tryout UTBK 1',
        start_date: new Date('2025-01-25T07:00:00Z'),
        end_date: new Date('2025-01-26T23:30:00Z'),
        description: 'Latihan soal UTBK dengan full sistem...',
      },
      {
        id: '2',
        program_id: programId,
        agenda: 'Tryout UTBK 2',
        start_date: new Date('2025-01-25T07:00:00Z'),
        end_date: new Date('2025-01-26T23:30:00Z'),
        description: 'Latihan soal UTBK dengan full sistem...',
      },
      {
        id: '3',
        program_id: programId,
        agenda: 'Tryout UTBK 3',
        start_date: new Date('2025-01-25T07:00:00Z'),
        end_date: new Date('2025-01-26T23:30:00Z'),
        description: 'Latihan soal UTBK dengan full sistem...',
      },
      {
        id: '10854934-9582-4609-9885-0268f67815d7',
        program_id: programId,
        agenda: 'Sosialisasi Legacy Project',
        start_date: new Date('2025-01-01T08:00:00Z'),
        end_date: new Date('2025-01-29T15:00:00Z'),
        description: 'Sosialisasi terkait SNPMB 2025...',
      },
    ],
  });

  console.log('AgendaProgram seeded successfully');
}

//tes
// async function main() {
//   console.log('Seeding...');
//   const programId = '44c0e324-55a6-4b56-a1ef-a1ddffaf309e';

//   // Create Soal
//   const soal = await prisma.programSoal.create({
//     data: {
//       title: 'Tes Dasar Kepemimpinan 2',
//       program_id: programId,
//       grade_id: 1,
//       duration: 20,
//       total_question: 2,
//       price: 0,
//       is_free: true,
//       is_public: true,
//       rating: 8.7,
//       creator_id: 1,
//     },
//   });

//   // Create Questions and Options
//   const questions = [
//     {
//       question: 'Berapa Kaki manusia?',
//       correct: 'C',
//       options: [
//         { label: 'A', content: '1' },
//         { label: 'B', content: '2' },
//         { label: 'C', content: '3' },
//         { label: 'D', content: '4' },
//       ],
//     },
//     {
//       question: 'Berapa Lubang Hidung Manusia',
//       correct: 'C',
//       options: [
//         { label: 'A', content: '3' },
//         { label: 'B', content: '4' },
//         { label: 'C', content: '2' },
//         { label: 'D', content: '1' },
//       ],
//     },
//   ];

//   for (const q of questions) {
//     const question = await prisma.programQuestion.create({
//       data: {
//         soal_id: soal.id,
//         question: q.question,
//         correct: q.correct,
//       },
//     });

//     for (const option of q.options) {
//       await prisma.programOption.create({
//         data: {
//           question_id: question.id,
//           label: option.label,
//           content: option.content,
//         },
//       });
//     }
//   }

//   console.log('Seeding complete.');
// }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
