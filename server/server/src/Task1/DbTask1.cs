namespace server.src.Task1 {
    public class DbTask1Text {
        public int Id { get; set; }
        public Task1.Theme Theme { get; set; }
        public string Text { get; set; } = null!;
    }
    public class DbTask1Question {
        public int Id { get; set; }
        public int TextId { get; set; }
        public string Question { get; set; } = null!;
        public string[] Variants { get; set; } = null!;
        public int AnswerId { get; set; }
    }
}