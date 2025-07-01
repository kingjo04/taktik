const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API' });
});

// Endpoint untuk mengambil data soal
app.get('/api/soal', async (req, res) => {
  try {
    const { page = 1, perPage = 1000, category_id } = req.query;
    const skip = (page - 1) * perPage;
    const take = parseInt(perPage);

    const filters = {};
    if (category_id) {
      filters.category_id = parseInt(category_id);
    }

    const soalData = await prisma.soal.findMany({
      skip,
      take,
      where: filters,
      include: {
        exam_category: true,
        category: true,
      },
    });

    const totalRows = await prisma.soal.count({ where: filters });
    const totalPage = Math.ceil(totalRows / take);

    res.json({
      data: soalData,
      pagination: {
        total_rows: totalRows,
        total_perpage: take,
        total_page: totalPage,
        current_page: parseInt(page),
        next_page: page < totalPage ? parseInt(page) + 1 : null,
        previous_page: page > 1 ? parseInt(page) - 1 : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kesalahan Server Internal' });
  }
});

// Endpoint untuk mengambil soal berdasarkan ID
app.get('/api/soal/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const soal = await prisma.soal.findUnique({
      where: { id: parseInt(id) },
      include: {
        exam_category: true,
        category: true,
      },
    });

    if (!soal) {
      return res.status(404).json({ error: 'Soal tidak ditemukan' });
    }

    res.json(soal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kesalahan Server Internal' });
  }
});

app.get('/api/soali/:soal_id', async (req, res) => {
  const { soal_id } = req.params;

  try {
    const soal = await prisma.soal.findUnique({
      where: { id: parseInt(soal_id) },
      include: {
        exam_category: true,
        category: true,
        questions: {
          include: { options: true },
        },
      },
    });

    if (!soal) {
      return res.status(404).json({ error: 'Soal tidak ditemukan' });
    }

    res.status(200).json(soal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil soal' });
  }
});

// Endpoint untuk mengirim jawaban
app.post('/api/answers', async (req, res) => {
  const { user_id, soal_id, answers } = req.body;

  if (!user_id || !soal_id || !Array.isArray(answers)) {
    return res.status(400).json({
      error: 'Permintaan tidak valid. Pastikan user_id, soal_id, dan answers disediakan.',
    });
  }

  const soalId = parseInt(soal_id);
  if (isNaN(soalId)) {
    return res.status(400).json({ error: 'soal_id tidak valid' });
  }

  try {
    const questions = await prisma.question.findMany({
      where: { soal_id: soalId },
    });

    if (!questions.length) {
      return res.status(404).json({ error: 'Tidak ada pertanyaan untuk soal_id ini' });
    }

    const userAnswersPromises = questions.map(async (question) => {
      const userAnswer = answers.find((a) => a.question_id === question.id);
      if (!userAnswer) return 0;

      const isCorrect = userAnswer.chosen === question.correct;

      return isCorrect ? 100 / questions.length : 0;
    });

    const scores = await Promise.all(userAnswersPromises);
    const totalScore = scores.reduce((acc, curr) => acc + curr, 0);

    await prisma.history.create({
      data: {
        user_id,
        soal_id: soalId,
        score: Math.round(totalScore),
        answers: JSON.stringify(answers),
      },
    });

    res.status(200).json({
      message: 'Jawaban berhasil disimpan',
      score: Math.round(totalScore),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kesalahan server internal' });
  }
});

// Endpoint riwayat berdasarkan soal_id dan user_id
app.get('/api/riwayat/:soal_id', async (req, res) => {
  const { soal_id } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id ' });
  }

  try {
    const history = await prisma.history.findFirst({
      where: { user_id: parseInt(user_id), soal_id: parseInt(soal_id) },
    });

    if (!history) {
      return res.status(404).json({ message: 'Riwayat tidak ditemukan untuk user dan soal ini' });
    }

    return res.status(200).json({
      status: 'sukses',
      data: history,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Endpoint riwayat berdasarkan user_id dan soalId
app.get('/api/history', async (req, res) => {
  const { user_id, soalId } = req.query;

  if (!user_id || !soalId) {
    return res.status(400).json({ message: 'user_id dan soalId diperlukan' });
  }

  try {
    const history = await prisma.history.findMany({
      where: {
        user_id: parseInt(user_id),
        soal_id: parseInt(soalId),
      },
    });

    if (history.length === 0) {
      return res.status(404).json({ message: 'Riwayat tidak ditemukan' });
    }

    res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Endpoint riwayat berdasarkan soalId dan user_id
app.get('/api/historya/:soalId', async (req, res) => {
  const { soalId } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id diperlukan' });
  }

  try {
    const history = await prisma.history.findMany({
      where: {
        user_id: parseInt(user_id),
        soal_id: parseInt(soalId),
      },
      include: {
        soal: true,
      },
    });

    if (history.length === 0) {
      return res.status(404).json({ message: 'Riwayat tidak ditemukan' });
    }

    res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Endpoint untuk mendapatkan kunci jawaban
app.get('/api/soal/kunci_jawaban/:id', async (req, res) => {
  try {
    const soalId = parseInt(req.params.id, 10);

    const soal = await prisma.soal.findUnique({
      where: { id: soalId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!soal) {
      return res.status(404).json({ message: 'Soal tidak ditemukan' });
    }

    const answers = soal.questions.map((question) => ({
      id: question.id,
      question: question.question,
      correct: question.correct,
    }));

    res.json(answers);
  } catch (error) {
    console.error('Kesalahan saat mengambil kunci jawaban:', error);
    res.status(500).json({ message: 'Kesalahan server internal' });
  }
});

// Endpoint untuk mengirim rating tanpa user_id
app.post('/api/soal/rating/:id', async (req, res) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  try {
    const soalExists = await prisma.soal.findUnique({
      where: { id: parseInt(id) },
    });
    if (!soalExists) {
      return res.status(404).json({ error: 'Soal tidak ditemukan' });
    }

    const newRating = await prisma.feedback.create({
      data: {
        soal_id: parseInt(id),
        rating,
        feedback,
      },
    });

    res.status(200).json({ message: 'Rating berhasil disimpan', newRating });
  } catch (error) {
    console.error('Kesalahan saat menyimpan rating:', error);
    res.status(500).json({ error: 'Gagal menyimpan rating' });
  }
});

// Endpoint untuk mengirim rating dengan user_id
app.post('/submit-rating', async (req, res) => {
  const { soal_id, user_id, rating, feedback } = req.body;

  if (!soal_id || !user_id || !rating) {
    return res.status(400).json({ error: 'soal_id, user_id, atau rating tidak ada' });
  }

  try {
    const newFeedback = await prisma.feedback.create({
      data: {
        soal_id,
        user_id,
        rating,
        feedback,
      },
    });

    res.status(200).json({
      message: 'Rating dan feedback berhasil disimpan',
      newFeedback,
    });
  } catch (error) {
    console.error('Kesalahan saat mengirim rating:', error);
    res.status(500).json({ error: 'Gagal mengirim rating' });
  }
});

app.get('/feedback/:soal_id', async (req, res) => {
  const { soal_id } = req.params;

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { soal_id: parseInt(soal_id) },
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Kesalahan saat mengambil feedback:', error);
    res.status(500).json({ error: 'Gagal mengambil feedback' });
  }
});

// Endpoint untuk mengirim rating dengan user_id dari body
app.post('/rating/:id', async (req, res) => {
  const { id } = req.params;
  const { rating, feedback, user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id diperlukan' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating harus antara 1 dan 5' });
  }

  try {
    const newRating = await prisma.feedback.create({
      data: {
        soal_id: parseInt(id),
        user_id: parseInt(user_id),
        rating,
        feedback,
      },
    });

    res.status(200).json({
      message: 'Rating berhasil disimpan',
      data: newRating,
    });
  } catch (error) {
    console.error('Kesalahan saat menyimpan rating:', error);
    res.status(500).json({ error: 'Gagal menyimpan rating' });
  }
});

app.get('/programs', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const skip = (page - 1) * pageSize;

  const total = await prisma.program.count();
  const programs = await prisma.program.findMany({
    skip,
    take: pageSize,
  });

  res.json({
    status: 200,
    message: 'Berhasil mendapatkan list program',
    errors: null,
    data: {
      page,
      page_size: pageSize,
      total,
      total_pages: Math.ceil(total / pageSize),
      programs,
    },
  });
});

app.get('/programs/:id', async (req, res) => {
  const { id } = req.params;
  const program = await prisma.program.findUnique({
    where: { id },
  });

  if (!program) {
    return res.status(404).json({
      status: 404,
      message: 'Program tidak ditemukan',
      errors: null,
      data: null,
    });
  }

  res.json({
    status: 200,
    message: 'Berhasil mendapatkan data program',
    errors: null,
    data: program,
  });
});

app.get('/programs/:program_id/agenda', async (req, res) => {
  try {
    const { program_id } = req.params;

    const agendas = await prisma.agendaProgram.findMany({
      where: { program_id },
      orderBy: { start_date: 'asc' },
    });

    res.json({
      status: 200,
      message: 'Berhasil mendapatkan agenda program',
      errors: null,
      data: agendas,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Kesalahan server', errors: error });
  }
});

app.get('/programs/tryout/:program_id', async (req, res) => {
  try {
    const { program_id } = req.params;

    const soalData = await prisma.programSoal.findMany({
      where: { program_id },
    });

    res.json({
      data: soalData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kesalahan Server Internal' });
  }
});

app.get('/programs/tryout/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const soal = await prisma.programSoal.findUnique({
      where: { id: parseInt(id) },
    });

    if (!soal) {
      return res.status(404).json({ error: 'Soal tidak ditemukan' });
    }

    res.json(soal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kesalahan Server Internal' });
  }
});

app.get('/programs/soali/:soal_id', async (req, res) => {
  const { soal_id } = req.params;

  try {
    const soal = await prisma.programSoal.findUnique({
      where: { id: parseInt(soal_id) },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    if (!soal) {
      return res.status(404).json({ error: 'Soal tidak ditemukan' });
    }

    res.status(200).json(soal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil soal' });
  }
});

app.post('/programs/answers', async (req, res) => {
  const { user_id, soal_id, answers } = req.body;

  if (!user_id || !soal_id || !Array.isArray(answers)) {
    return res.status(400).json({
      error: 'Permintaan tidak valid. Pastikan user_id, soal_id, dan answers disediakan.',
    });
  }

  const soalId = parseInt(soal_id);
  if (isNaN(soalId)) {
    return res.status(400).json({ error: 'soal_id tidak valid' });
  }

  try {
    const questions = await prisma.programQuestion.findMany({
      where: { soal_id: soalId },
    });

    if (!questions.length) {
      return res.status(404).json({ error: 'Tidak ada pertanyaan untuk soal_id ini' });
    }

    const userAnswersPromises = questions.map(async (question) => {
      const userAnswer = answers.find((a) => a.question_id === question.id);
      if (!userAnswer) return 0;

      const isCorrect = userAnswer.chosen === question.correct;

      return isCorrect ? 100 / questions.length : 0;
    });

    const scores = await Promise.all(userAnswersPromises);
    const totalScore = scores.reduce((acc, curr) => acc + curr, 0);

    await prisma.programHistory.create({
      data: {
        user_id,
        soal_id: soalId,
        score: Math.round(totalScore),
        answers: JSON.stringify(answers),
      },
    });

    res.status(200).json({
      message: 'Jawaban berhasil disimpan',
      score: Math.round(totalScore),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kesalahan server internal' });
  }
});

app.get('/programs/historya/:soalId', async (req, res) => {
  const { soalId } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id diperlukan' });
  }

  try {
    const history = await prisma.programHistory.findMany({
      where: {
        user_id: parseInt(user_id),
        soal_id: parseInt(soalId),
      },
      include: {
        soal: true,
      },
    });

    if (history.length === 0) {
      return res.status(404).json({ message: 'Riwayat tidak ditemukan' });
    }

    res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
});

app.get('/programs/soal/kunci_jawaban/:id', async (req, res) => {
  try {
    const soalId = parseInt(req.params.id, 10);

    if (isNaN(soalId)) {
      return res.status(400).json({ message: 'ID soal tidak valid' });
    }

    const soal = await prisma.programSoal.findUnique({
      where: { id: soalId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!soal) {
      return res.status(404).json({ message: 'Soal tidak ditemukan' });
    }

    const answers = soal.questions.map((question) => ({
      id: question.id,
      question: question.question,
      correct: question.correct,
      options: question.options.map((opt) => ({
        label: opt.label,
        content: opt.content,
      })),
    }));

    res.json({ soalId: soal.id, title: soal.title, answers });
  } catch (error) {
    console.error('Kesalahan saat mengambil kunci jawaban:', error);
    res.status(500).json({ message: 'Kesalahan server internal' });
  }
});

app.get('/materi/:programId', async (req, res) => {
  try {
    const { programId } = req.params;

    const materi = await prisma.materi.findMany({
      where: { programId },
    });

    res.json({ success: true, data: materi });
  } catch (error) {
    console.error('Kesalahan saat mengambil materi:', error);
    res.status(500).json({ success: false, message: 'Kesalahan server internal' });
  }
});

app.get('/api/historyall', async (req, res) => {
  try {
    const history = await prisma.history.findMany({
      where: {
        score: {
          lt: 50,
        },
      },
      include: {
        soal: true,
      },
    });

    if (history.length === 0) {
      return res.status(404).json({ message: 'Tidak ada riwayat dengan skor di bawah 50' });
    }

    res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});