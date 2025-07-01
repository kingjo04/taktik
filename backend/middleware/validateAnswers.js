const validateAnswers = (req, res, next) => {
  const { user_id, soal_id, answers } = req.body;

  if (!user_id || !soal_id || !Array.isArray(answers)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid request. Ensure user_id, soal_id, and answers are provided.",
      });
  }

  // Periksa apakah setiap item dalam answers memiliki question_id dan chosen
  const invalidAnswer = answers.find(
    (answer) => !answer.question_id || typeof answer.chosen !== "string"
  );

  if (invalidAnswer) {
    return res.status(400).json({
      error:
        "Invalid answers format. Each answer must include question_id and chosen.",
    });
  }

  next(); // Lanjutkan ke handler berikutnya
};
