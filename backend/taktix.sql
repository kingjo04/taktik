```sql
-- Drop tables in dependency order to avoid conflicts
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
DROP TABLE IF EXISTS "UserAnswer" CASCADE;
DROP TABLE IF EXISTS "History" CASCADE;
DROP TABLE IF EXISTS "Feedback" CASCADE;
DROP TABLE IF EXISTS "Option" CASCADE;
DROP TABLE IF EXISTS "Question" CASCADE;
DROP TABLE IF EXISTS "Soal" CASCADE;
DROP TABLE IF EXISTS "ExamCategory" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "ProgramUserAnswer" CASCADE;
DROP TABLE IF EXISTS "ProgramHistory" CASCADE;
DROP TABLE IF EXISTS "ProgramFeedback" CASCADE;
DROP TABLE IF EXISTS "ProgramOption" CASCADE;
DROP TABLE IF EXISTS "ProgramQuestion" CASCADE;
DROP TABLE IF EXISTS "ProgramSoal" CASCADE;
DROP TABLE IF EXISTS "AgendaProgram" CASCADE;
DROP TABLE IF EXISTS "Materi" CASCADE;
DROP TABLE IF EXISTS "Program" CASCADE;

-- Table: Category
CREATE TABLE "Category" (
  "id" SERIAL PRIMARY KEY,
  "category" VARCHAR(191) NOT NULL,
  "name" VARCHAR(191) NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  "deleted_at" timestamp(3)
);

INSERT INTO "Category" ("id","category","name","created_at","updated_at","deleted_at") VALUES
(1,'cpns','CPNS','2024-12-16 07:32:59.637','2024-12-16 07:32:59.637',NULL),
(2,'kedinasan','Kedinasan','2024-12-16 07:32:59.656','2024-12-16 07:32:59.656',NULL),
(3,'utbk','UTBK','2024-12-16 07:32:59.659','2024-12-16 07:32:59.659',NULL),
(4,'Basic','Basic Mathematics','2024-12-18 08:41:13.052','2024-12-18 08:41:13.052',NULL),
(5,'Basic','Basic Mathematics','2024-12-28 16:07:45.472','2024-12-28 16:07:45.472',NULL);

-- Table: ExamCategory
CREATE TABLE "ExamCategory" (
  "id" SERIAL PRIMARY KEY,
  "category" VARCHAR(191) NOT NULL,
  "name" VARCHAR(191) NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  "deleted_at" timestamp(3)
);

INSERT INTO "ExamCategory" ("id","category","name","created_at","updated_at","deleted_at") VALUES
(1,'exam_category','Kemampuan Penalaran Umum','2024-12-16 07:32:59.662','2024-12-16 07:32:59.662',NULL),
(2,'exam_category','Kemampuan Kuantitatif','2024-12-16 07:32:59.665','2024-12-16 07:32:59.665',NULL),
(3,'exam_category','Kemampuan Bahasa Inggris','2024-12-16 07:32:59.668','2024-12-16 07:32:59.668',NULL),
(4,'Math','Mathematics','2024-12-18 08:41:13.030','2024-12-18 08:41:13.030',NULL),
(5,'Math','Mathematics','2024-12-28 16:07:45.431','2024-12-28 16:07:45.431',NULL);

-- Table: Soal
CREATE TABLE "Soal" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(191) NOT NULL,
  "category_id" INT NOT NULL,
  "exam_category_id" INT NOT NULL,
  "grade_id" INT NOT NULL,
  "duration" INT NOT NULL,
  "total_question" INT NOT NULL,
  "price" INT NOT NULL,
  "is_free" BOOLEAN NOT NULL,
  "is_public" BOOLEAN NOT NULL,
  "rating" DOUBLE PRECISION NOT NULL,
  "banner_image" VARCHAR(191),
  "creator_id" INT NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  "deleted_at" timestamp(3),
  FOREIGN KEY ("category_id") REFERENCES "Category"("id"),
  FOREIGN KEY ("exam_category_id") REFERENCES "ExamCategory"("id")
);

INSERT INTO "Soal" ("id","title","category_id","exam_category_id","grade_id","duration","total_question","price","is_free","is_public","rating","banner_image","creator_id","created_at","updated_at","deleted_at") VALUES
(1,'Soal Latihan 1',1,1,1,60,10,0,TRUE,TRUE,4.5,NULL,1,'2024-12-16 07:32:59.673','2024-12-16 07:32:59.673',NULL),
(2,'Soal Latihan 2',2,2,2,90,20,0,TRUE,TRUE,4.7,NULL,1,'2024-12-16 07:32:59.682','2024-12-16 07:32:59.682',NULL),
(3,'Soal CPNS 1',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.022','2024-12-18 07:37:26.022',NULL),
(4,'Soal CPNS 2',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.054','2024-12-18 07:37:26.054',NULL),
(5,'Soal CPNS 3',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.058','2024-12-18 07:37:26.058',NULL),
(6,'Soal CPNS 4',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.063','2024-12-18 07:37:26.063',NULL),
(7,'Soal CPNS 5',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.067','2024-12-18 07:37:26.067',NULL),
(8,'Soal CPNS 6',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.071','2024-12-18 07:37:26.071',NULL),
(9,'Soal CPNS 7',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.075','2024-12-18 07:37:26.075',NULL),
(10,'Soal CPNS 8',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.078','2024-12-18 07:37:26.078',NULL),
(11,'Soal CPNS 9',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.081','2024-12-18 07:37:26.081',NULL),
(12,'Soal CPNS 10',1,1,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.084','2024-12-18 07:37:26.084',NULL),
(13,'Soal Kedinasan 1',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.088','2024-12-18 07:37:26.088',NULL),
(14,'Soal Kedinasan 2',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.092','2024-12-18 07:37:26.092',NULL),
(15,'Soal Kedinasan 3',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.096','2024-12-18 07:37:26.096',NULL),
(16,'Soal Kedinasan 4',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.099','2024-12-18 07:37:26.099',NULL),
(17,'Soal Kedinasan 5',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.102','2024-12-18 07:37:26.102',NULL),
(18,'Soal Kedinasan 6',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.105','2024-12-18 07:37:26.105',NULL),
(19,'Soal Kedinasan 7',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.108','2024-12-18 07:37:26.108',NULL),
(20,'Soal Kedinasan 8',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.112','2024-12-18 07:37:26.112',NULL),
(21,'Soal Kedinasan 9',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.115','2024-12-18 07:37:26.115',NULL),
(22,'Soal Kedinasan 10',2,2,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.118','2024-12-18 07:37:26.118',NULL),
(23,'Soal UTBK 1',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.121','2024-12-18 07:37:26.121',NULL),
(24,'Soal UTBK 2',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.124','2024-12-18 07:37:26.124',NULL),
(25,'Soal UTBK 3',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.127','2024-12-18 07:37:26.127',NULL),
(26,'Soal UTBK 4',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.130','2024-12-18 07:37:26.130',NULL),
(27,'Soal UTBK 5',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.134','2024-12-18 07:37:26.134',NULL),
(28,'Soal UTBK 6',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.137','2024-12-18 07:37:26.137',NULL),
(29,'Soal UTBK 7',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.140','2024-12-18 07:37:26.140',NULL),
(30,'Soal UTBK 8',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.142','2024-12-18 07:37:26.142',NULL),
(31,'Soal UTBK 9',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.145','2024-12-18 07:37:26.145',NULL),
(32,'Soal UTBK 10',3,3,1,60,10,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 07:37:26.148','2024-12-18 07:37:26.148',NULL),
(33,'Basic Math Exam',4,4,1,60,3,0,TRUE,TRUE,8.7,NULL,1,'2024-12-18 08:41:13.056','2024-12-18 08:41:13.056',NULL),
(34,'Basic Math Exam',5,5,1,60,3,0,TRUE,TRUE,8.7,NULL,1,'2024-12-28 16:07:45.477','2024-12-28 16:07:45.477',NULL);

-- Table: Question
CREATE TABLE "Question" (
  "id" SERIAL PRIMARY KEY,
  "soal_id" INT NOT NULL,
  "question" VARCHAR(191) NOT NULL,
  "correct" VARCHAR(191) NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  FOREIGN KEY ("soal_id") REFERENCES "Soal"("id")
);

INSERT INTO "Question" ("id","soal_id","question","correct","created_at","updated_at") VALUES
(1,33,'What is 2 + 2?','A','2024-12-18 08:41:13.061','2024-12-18 08:41:13.061'),
(2,33,'What is 3 * 3?','B','2024-12-18 08:41:13.076','2024-12-18 08:41:13.076'),
(3,33,'What is 10 - 5?','C','2024-12-18 08:41:13.089','2024-12-18 08:41:13.089'),
(4,34,'What is 2 + 2?','A','2024-12-28 16:07:45.484','2024-12-28 16:07:45.484'),
(5,34,'What is 3 * 3?','B','2024-12-28 16:07:45.501','2024-12-28 16:07:45.501'),
(6,34,'What is 10 - 5?','C','2024-12-28 16:07:45.513','2024-12-28 16:07:45.513');

-- Table: Option
CREATE TABLE "Option" (
  "id" SERIAL PRIMARY KEY,
  "question_id" INT NOT NULL,
  "label" VARCHAR(191) NOT NULL,
  "content" VARCHAR(191) NOT NULL,
  FOREIGN KEY ("question_id") REFERENCES "Question"("id")
);

INSERT INTO "Option" ("id","question_id","label","content") VALUES
(1,1,'A','4'),(2,1,'B','3'),(3,1,'C','5'),(4,1,'D','6'),
(5,2,'A','6'),(6,2,'B','9'),(7,2,'C','12'),(8,2,'D','15'),
(9,3,'A','6'),(10,3,'B','4'),(11,3,'C','5'),(12,3,'D','3'),
(13,4,'A','4'),(14,4,'B','3'),(15,4,'C','5'),(16,4,'D','6'),
(17,5,'A','6'),(18,5,'B','9'),(19,5,'C','12'),(20,5,'D','15'),
(21,6,'A','6'),(22,6,'B','4'),(23,6,'C','5'),(24,6,'D','3');

-- Table: Feedback
CREATE TABLE "Feedback" (
  "id" SERIAL PRIMARY KEY,
  "rating" INT NOT NULL,
  "feedback" VARCHAR(191) NOT NULL,
  "soal_id" INT NOT NULL,
  FOREIGN KEY ("soal_id") REFERENCES "Soal"("id")
);

-- Table: History
CREATE TABLE "History" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "soal_id" INT NOT NULL,
  "score" INT NOT NULL,
  "answers" JSONB NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  FOREIGN KEY ("soal_id") REFERENCES "Soal"("id")
);

INSERT INTO "History" ("id","user_id","soal_id","score","answers","created_at","updated_at") VALUES
(3,38,33,67,'[{"question_id":1,"chosen":"A"},{"question_id":2,"chosen":"B"},{"question_id":3,"chosen":"A"}]','2025-01-08 14:56:29.480','2025-01-08 14:56:29.480'),
(5,38,33,33,'[{"question_id":1,"chosen":"A"},{"question_id":2,"chosen":"D"},{"question_id":3,"chosen":"D"}]','2025-01-08 15:02:07.234','2025-01-08 15:02:07.234'),
(6,38,33,100,'[{"question_id":1,"chosen":"A"},{"question_id":2,"chosen":"B"},{"question_id":3,"chosen":"C"}]','2025-01-08 15:04:15.664','2025-01-08 15:04:15.664'),
(7,38,33,100,'[{"question_id":1,"chosen":"A"},{"question_id":2,"chosen":"B"},{"question_id":3,"chosen":"C"}]','2025-01-09 05:18:53.588','2025-01-09 05:18:53.588'),
(8,38,34,33,'[{"question_id":4,"chosen":"A"},{"question_id":5,"chosen":"D"},{"question_id":6,"chosen":"D"}]','2025-01-09 05:40:40.521','2025-01-09 05:40:40.521'),
(9,38,33,0,'[]','2025-01-09 05:44:36.782','2025-01-09 05:44:36.782');

-- Table: UserAnswer
CREATE TABLE "UserAnswer" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "soal_id" INT NOT NULL,
  "question_id" INT NOT NULL,
  "chosen" VARCHAR(191) NOT NULL,
  "is_correct" BOOLEAN NOT NULL,
  FOREIGN KEY ("soal_id") REFERENCES "Soal"("id"),
  FOREIGN KEY ("question_id") REFERENCES "Question"("id")
);

-- Table: Program
CREATE TABLE "Program" (
  "id" VARCHAR(191) PRIMARY KEY,
  "name" VARCHAR(191) NOT NULL,
  "start_date" timestamp(3) NOT NULL,
  "end_date" timestamp(3) NOT NULL,
  "description" TEXT,
  "creator_id" INT NOT NULL,
  "price" INT NOT NULL,
  "image_banner" VARCHAR(191) NOT NULL,
  "is_enrolled" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  "status_id" INT NOT NULL,
  "matter_id" INT NOT NULL,
  "with_passing_grade" BOOLEAN NOT NULL
);

-- Table: Materi
CREATE TABLE "Materi" (
  "id" SERIAL PRIMARY KEY,
  "programId" VARCHAR(191) NOT NULL,
  "title" VARCHAR(191) NOT NULL,
  "youtubeLink" VARCHAR(191) NOT NULL,
  FOREIGN KEY ("programId") REFERENCES "Program"("id")
);

-- Table: AgendaProgram
CREATE TABLE "AgendaProgram" (
  "id" VARCHAR(191) PRIMARY KEY,
  "program_id" VARCHAR(191) NOT NULL,
  "agenda" VARCHAR(191) NOT NULL,
  "start_date" timestamp(3) NOT NULL,
  "end_date" timestamp(3) NOT NULL,
  "description" VARCHAR(191),
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  FOREIGN KEY ("program_id") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: ProgramSoal
CREATE TABLE "ProgramSoal" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(191) NOT NULL,
  "program_id" VARCHAR(191) NOT NULL,
  "grade_id" INT NOT NULL,
  "duration" INT NOT NULL,
  "total_question" INT NOT NULL,
  "price" INT NOT NULL,
  "is_free" BOOLEAN NOT NULL,
  "is_public" BOOLEAN NOT NULL,
  "rating" DOUBLE PRECISION NOT NULL,
  "banner_image" VARCHAR(191),
  "creator_id" INT NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  "deleted_at" timestamp(3),
  FOREIGN KEY ("program_id") REFERENCES "Program"("id")
);

-- Table: ProgramQuestion
CREATE TABLE "ProgramQuestion" (
  "id" SERIAL PRIMARY KEY,
  "soal_id" INT NOT NULL,
  "question" VARCHAR(191) NOT NULL,
  "correct" VARCHAR(191) NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  FOREIGN KEY ("soal_id") REFERENCES "ProgramSoal"("id")
);

-- Table: ProgramOption
CREATE TABLE "ProgramOption" (
  "id" SERIAL PRIMARY KEY,
  "question_id" INT NOT NULL,
  "label" VARCHAR(191) NOT NULL,
  "content" VARCHAR(191) NOT NULL,
  FOREIGN KEY ("question_id") REFERENCES "ProgramQuestion"("id")
);

-- Table: ProgramFeedback
CREATE TABLE "ProgramFeedback" (
  "id" SERIAL PRIMARY KEY,
  "rating" INT NOT NULL,
  "feedback" VARCHAR(191) NOT NULL,
  "soal_id" INT NOT NULL,
  FOREIGN KEY ("soal_id") REFERENCES "ProgramSoal"("id")
);

-- Table: ProgramHistory
CREATE TABLE "ProgramHistory" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "soal_id" INT NOT NULL,
  "score" INT NOT NULL,
  "answers" JSONB NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  FOREIGN KEY ("soal_id") REFERENCES "ProgramSoal"("id")
);

-- Table: ProgramUserAnswer
CREATE TABLE "ProgramUserAnswer" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "soal_id" INT NOT NULL,
  "question_id" INT NOT NULL,
  "chosen" VARCHAR(191) NOT NULL,
  "is_correct" BOOLEAN NOT NULL,
  FOREIGN KEY ("soal_id") REFERENCES "ProgramSoal"("id"),
  FOREIGN KEY ("question_id") REFERENCES "ProgramQuestion"("id")
);

-- Table: _prisma_migrations
CREATE TABLE "_prisma_migrations" (
  "id" VARCHAR(36) PRIMARY KEY,
  "checksum" VARCHAR(64) NOT NULL,
  "finished_at" timestamp(3),
  "migration_name" VARCHAR(255) NOT NULL,
  "logs" TEXT,
  "rolled_back_at" timestamp(3),
  "started_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "applied_steps_count" INT NOT NULL DEFAULT 0
);
```