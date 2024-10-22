namespace server.UserNamespace {
    public class DbTask1History
    {
        public int Id { get; set; }
        public int QuestionsId { get; set; }
        public string[] Answers { get; set; } = new string[0];
        public DateTime TimePlayed { get; set; } = DateTime.UtcNow;
    }
}