namespace server.src.Task2 {
    public class DbTask2Text {
        
        public int Id { get; set; }
        public Task2Data.Theme Theme { get; set; }
        public string[] Text { get; set; } = null!;
    }
}