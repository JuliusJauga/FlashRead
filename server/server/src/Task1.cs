namespace server {
    public class Task1 : ITask {
        private enum Theme : uint {
            ANY, HISTORY, TECHNOLOGY, ANIME, POLITICS
        }
        private enum Difficulty : uint {
            ANY, EASY, MEDIUM, HARD, EXTREME
        }
        public record TaskQuestion {
            public required string Question {get; set;}
            public required string[] Variants {get; set;}
            public int? CorrectVariant {get; set;}
            public bool? IsSelectedCorrectly {get; set;}
        }
        public record TaskResponse : ITaskResponse {
            public required string Text { get; set; }
            public required TaskQuestion[] Questions { get; set; }
            public uint Session { get; set; }
        }
        public record TaskAnswerResponse : ITaskAnswerResponse {
            public required TaskQuestion[] Answers { get; set; }
        }
        public ITaskResponse GetResponse(TaskRequest request) {
            Theme theme = request.Theme.ToEnum(Theme.ANY);
            Difficulty difficulty = request.Difficulty.ToEnum(Difficulty.ANY);
            
            // generate a session (seed), later will be used to reconstruct questions so we don't need to track them
            // 2 bits task id, 22 bits random, 4 bits theme, 4 bits difficulty
            uint session = ITask.GenerateSessionBase(request.TaskId);
            session &= ~0xFFU;
            session |= (uint)theme << 4;
            session |= (uint)difficulty;

            (string text, TaskQuestion[] questions) = GenerateData(session, theme, difficulty, queryAnswers: false);

            return new TaskResponse {
                Session = session,
                Text = text,
                Questions = questions
            };
        }
        public ITaskAnswerResponse CheckAnswer(TaskAnswerRequest request) {
            // decode theme and difficulty from session
            uint themeId = (request.Session >> 4) & 0xF;
            uint difficultyId = (request.Session) & 0xF;

            // generate the same questions as in GetResponse
            (string _, TaskQuestion[] questions) = GenerateData(request.Session, (Theme)themeId, (Difficulty)difficultyId,
                                                                queryText: false);

            // compare answers
            for (int i = 0; i < questions.Length; i++) {
                if (request.SelectedVariants == null || i >= request.SelectedVariants.Length) {
                    questions[i].IsSelectedCorrectly = false;
                    continue;
                }
                if (questions[i].CorrectVariant == request.SelectedVariants[i]) {
                    questions[i].IsSelectedCorrectly = true;
                } else {
                    questions[i].IsSelectedCorrectly = false;
                }
            }

            return new TaskAnswerResponse {
                Answers = questions
            };
        }
        private static (string, TaskQuestion[]) GenerateData(uint sessionId, Theme theme, Difficulty difficulty,
                                                             bool queryText = true, bool queryAnswers = true) {
            Random generator = new((int)sessionId);

            int availabeTextCount = 0; // TODO: query db
            int chosenTextIndex = generator.Next(availabeTextCount);

            int availableQuestionCount = 0; // TODO: query db by chosen text index

            int questionCount = Math.Min(availableQuestionCount, GetQuestionCountFromDifficulty(generator, difficulty));
            // use a hashset to guarantee unique question ids
            HashSet<int> questionIds = [];
            while (questionIds.Count < questionCount) {
                questionIds.Add(generator.Next(availableQuestionCount));
            }

            string text = "";
            if (queryText) {
                text = "LOREM IPSUM DAR POKOLKAS"; // TODO: query db
            }

            TaskQuestion[] questions = [    // TODO: query db for questions
                new TaskQuestion {
                    Question = "Test Q 1",
                    Variants = ["42", "24", "0", "1"]
                },
                new TaskQuestion {
                    Question = "Test Q 2",
                    Variants = ["random", "variant", "list", "here"]
                },
            ];
            Console.WriteLine(questionIds);
            return (text, questions);
        }
        private static int GetQuestionCountFromDifficulty(Random generator, Difficulty difficulty) {
            int countMin;
            int countMax;
            switch (difficulty) {
                case Difficulty.EASY:
                    countMin = 2;
                    countMax = 3;
                    break;
                case Difficulty.MEDIUM:
                    countMin = 4;
                    countMax = 5;
                    break;
                case Difficulty.HARD:
                    countMin = 6;
                    countMax = 7;
                    break;
                case Difficulty.EXTREME:
                    countMin = 8;
                    countMax = 10;
                    break;
                default:
                    countMin = 2;
                    countMax = 10;
                    break;
            }
            return generator.Next(countMin, countMax + 1);
        }
    }
}