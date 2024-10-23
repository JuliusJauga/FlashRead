using Microsoft.EntityFrameworkCore.Migrations;

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
            public string[]? WordArray {get; set;}
            public uint Session {get; set;}
        }

        public ITaskAnswerResponse CheckAnswer(TaskAnswerRequest request)
        {
            throw new NotImplementedException();
        }

        public ITaskResponse GetResponse(TaskRequest request)
        {
            if (request.Theme == "Any") {
                string[] themes = ["History", "Technology", "Anime"];
                request.Theme = themes[new Random().Next(0, themes.Length)];
            }
            Theme theme = request.Theme.ToEnum(Theme.Any);

            string[] textArray = [""];

            var dbText = _context.Task2Texts
                    .Where(t => t.Id == (int)theme)
                    .Select(t => t.Text)
                    .First();
                textArray = dbText;
                
            return new TaskResponse {
                WordArray = textArray
            };
        }
    }
}