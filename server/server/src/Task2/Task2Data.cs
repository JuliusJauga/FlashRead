namespace server.src.Task2 {
    public class Task2Data : ITask
    {
        private readonly FlashDbContext _context;
        public Task2Data(FlashDbContext context) {
            _context = context;
        }

        public enum Theme {
            Any, History, Technology, Anime, Fillers
        }

        public record TaskResponse : ITaskResponse {
            public string[]? TextArray {get; set;}
            public uint Session {get; set;}
        }

        public ITaskAnswerResponse CheckAnswer(TaskAnswerRequest request)
        {
            throw new NotImplementedException();
        }

        public ITaskResponse GetResponse(TaskRequest request)
        {
            Theme theme = request.Theme.ToEnum(Theme.Any);

            string[] textArray = [""];

            var availableTexts = theme == Theme.Any
                ? _context.Task2Texts
                    .Select(t => t.Id)
                    .ToArray()
                : _context.Task2Texts
                    .Where(t => t.Theme == theme)
                    .Select(t => t.Id)
                    .ToArray();
                    
            return new TaskResponse {
                TextArray = textArray
            };
        }
    }
}