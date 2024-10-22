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
            public uint Session {get; set;}
        }

        public ITaskAnswerResponse CheckAnswer(TaskAnswerRequest request)
        {
            throw new NotImplementedException();
        }

        public ITaskResponse GetResponse(TaskRequest request)
        {   

            int points = request.CurrentPoints ?? 0;

            
            string[] words = request.WordArray ?? [""];
            bool collision = request.Collision ?? false;
            
            int pointChange = CalculatePoints(request.CollectedWord, words, collision);
            

            points += pointChange;
            return new TaskResponse {
                Points = points
            };
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