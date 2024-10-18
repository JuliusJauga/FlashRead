namespace server.src.Task2 {
    public class DbTask2Text {
        public int Id { get; set; }
        public Task2.Theme Theme { get; set; }
        public string[] Text { get; set; } = null!;
    }
}