-- CreateTable
CREATE TABLE "ExamCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ExamCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Soal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "exam_category_id" INTEGER NOT NULL,
    "grade_id" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "total_question" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "is_free" BOOLEAN NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "banner_image" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Soal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "soal_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "correct" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "soal_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "chosen" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "soal_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "soal_id" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "creator_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "image_banner" TEXT NOT NULL,
    "is_enrolled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status_id" INTEGER NOT NULL,
    "matter_id" INTEGER NOT NULL,
    "with_passing_grade" BOOLEAN NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaProgram" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "agenda" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendaProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramSoal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "grade_id" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "total_question" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "is_free" BOOLEAN NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "banner_image" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ProgramSoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramQuestion" (
    "id" SERIAL NOT NULL,
    "soal_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "correct" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramOption" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ProgramOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramUserAnswer" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "soal_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "chosen" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,

    CONSTRAINT "ProgramUserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramHistory" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "soal_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramFeedback" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "soal_id" INTEGER NOT NULL,

    CONSTRAINT "ProgramFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materi" (
    "id" SERIAL NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "youtubeLink" TEXT NOT NULL,

    CONSTRAINT "Materi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Soal" ADD CONSTRAINT "Soal_exam_category_id_fkey" FOREIGN KEY ("exam_category_id") REFERENCES "ExamCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soal" ADD CONSTRAINT "Soal_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_soal_id_fkey" FOREIGN KEY ("soal_id") REFERENCES "Soal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_soal_id_fkey" FOREIGN KEY ("soal_id") REFERENCES "Soal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_soal_id_fkey" FOREIGN KEY ("soal_id") REFERENCES "Soal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_soal_id_fkey" FOREIGN KEY ("soal_id") REFERENCES "Soal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaProgram" ADD CONSTRAINT "AgendaProgram_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSoal" ADD CONSTRAINT "ProgramSoal_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramQuestion" ADD CONSTRAINT "ProgramQuestion_soal_id_fkey" FOREIGN KEY ("soal_id") REFERENCES "ProgramSoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramOption" ADD CONSTRAINT "ProgramOption_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "ProgramQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramUserAnswer" ADD CONSTRAINT "ProgramUserAnswer_soal_id_fkey" FOREIGN KEY ("soal_id") REFERENCES "ProgramSoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramUserAnswer" ADD CONSTRAINT "ProgramUserAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "ProgramQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramHistory" ADD CONSTRAINT "ProgramHistory_soal_id_fkey" FOREIGN KEY ("soal_id") REFERENCES "ProgramSoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramFeedback" ADD CONSTRAINT "ProgramFeedback_soal_id_fkey" FOREIGN KEY ("soal_id") REFERENCES "ProgramSoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materi" ADD CONSTRAINT "Materi_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
