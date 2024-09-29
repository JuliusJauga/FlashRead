namespace server.src.Task1 {
    public class Task1 : ITask {
        private readonly FlashDbContext _context;
        public Task1(FlashDbContext context) {
            _context = context;
        }
        
        public enum Theme {
            Any, History, Technology, Anime, Politics
        }
        private enum Difficulty {
            Any, Easy, Medium, Hard, Extreme
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
            Theme theme = request.Theme.ToEnum(Theme.Any);
            Difficulty difficulty = request.Difficulty.ToEnum(Difficulty.Any);

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
        private (string, TaskQuestion[]) GenerateData(uint sessionId, Theme theme, Difficulty difficulty,
                                                             bool queryText = true, bool queryAnswers = true) {
            Random generator = new((int)sessionId);

            // choose a text
            var availableTexts = theme == Theme.Any
                ? _context.Task1Texts
                    .Select(t => t.Id)
                    .ToArray()
                : _context.Task1Texts
                    .Where(t => t.Theme == theme)
                    .Select(t => t.Id)
                    .ToArray();
            
            if (availableTexts.Length == 0) {
                return ("", Array.Empty<TaskQuestion>());
            }
            int chosenTextIndex = availableTexts[generator.Next(availableTexts.Length)];

            // choose questions
            var availabeQuestions = _context.Task1Questions
                .Where(q => q.TextId == chosenTextIndex)
                .Select(q => q.Id)
                .ToArray();
            int questionCount = Math.Min(availabeQuestions.Length, GetQuestionCountFromDifficulty(generator, difficulty));
            
            // use a hashset to guarantee unique question ids
            HashSet<int> questionIds = [];
            while (questionIds.Count < questionCount) {
                int questionIdIndex = generator.Next(availabeQuestions.Length);
                questionIds.Add(availabeQuestions[questionIdIndex]);
            }

            string text = "";
            if (queryText) {
                var dbText = _context.Task1Texts
                    .Where(t => t.Id == chosenTextIndex)
                    .Select(t => t.Text)
                    .First();
                text = dbText ?? "";
            }

            List<TaskQuestion> questions = [];
            var dbQuestions = _context.Task1Questions
                .Where(q => questionIds.Contains(q.Id))
                .Select(q => new {q.Question, q.Variants, q.AnswerId})
                .ToList();
            foreach (var q in dbQuestions) {
                var tq = new TaskQuestion {
                    Question = q.Question,
                    Variants = q.Variants,
                };
                if (queryAnswers) tq.CorrectVariant = q.AnswerId;
                questions.Add(tq);
            }
            return (text, questions.ToArray());
        }
        private static int GetQuestionCountFromDifficulty(Random generator, Difficulty difficulty) {
            int countMin;
            int countMax;
            switch (difficulty) {
                case Difficulty.Easy:
                    countMin = 2;
                    countMax = 3;
                    break;
                case Difficulty.Medium:
                    countMin = 4;
                    countMax = 5;
                    break;
                case Difficulty.Hard:
                    countMin = 6;
                    countMax = 7;
                    break;
                case Difficulty.Extreme:
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