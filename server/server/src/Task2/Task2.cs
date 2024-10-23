namespace server.src.Task2 {
    public class Task2 : ITask {
        private readonly FlashDbContext _context;

        public Task2(FlashDbContext context) {
            _context = context;
        }

        public enum Theme {
            Any, History, Technology, Anime, Fillers
        }

        public record TaskResponse : ITaskResponse {
            public int Points { get; set; }
            public int Combo { get; set; }
            public uint Session {get; set;}
        }

        public ITaskAnswerResponse CheckAnswer(TaskAnswerRequest request)
        {
            throw new NotImplementedException();
        }

        public ITaskResponse GetResponse(TaskRequest request)
        {   

            int points = request.CurrentPoints ?? 0;
            int combo = request.CurrentCombo ?? 0;
            
            string[] words = request.WordArray ?? [""];
            bool collision = request.Collision ?? false;
            
            int pointChange = CalculatePoints(request.CollectedWord, words, collision);
            
            if (pointChange == -1) {
                if (combo <= 0) {
                    combo--;
                } else combo = 0;
            } else if (pointChange == 1) {
                if (combo >= 0) {
                    combo++;
                } else combo = 0;
            }

            if (pointChange != 0) {
                pointChange = CalculateCombo(pointChange, combo);
            }

            points += pointChange;
            return new TaskResponse {
                Points = points,
                Combo = combo
            };
        }   

        private int CalculateCombo(int points, int combo) {
            if (combo >= 0 && points > 0) {
                double multiplier = Math.Min(1 + (combo - 1) * 0.5, 5);
                return (int)(points * multiplier);
            } else if (combo <= 0 && points < 0) {
                double multiplier = Math.Max(1 + (combo + 1) * 0.5, -5);
                return (int)(points * Math.Abs(multiplier));  // Keep points negative but apply absolute value of multiplier
            }
            return points;
        }


        private int CalculatePoints(string? collectedWord, string[] words, bool collision)
        {
            if (collectedWord == null) return 0;

            if (collision) {
                if (words.Contains(collectedWord)) {
                    return 1;
                }
                return -1;
            }
            if (!collision) {
                if (words.Contains(collectedWord)) {
                    return -1;
                }
            }
            return 0;
        }

    }



}