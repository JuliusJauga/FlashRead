namespace server.UserNamespace {
    public class DbTask1Contribution
    {
        public string Id { get; set; } = null!;
        public int QuestionsId { get; set; }
        public DateTime TimeContributed { get; set; } = DateTime.UtcNow;
    }
}