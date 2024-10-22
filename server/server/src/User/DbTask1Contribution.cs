namespace server.UserNamespace {
    public class DbTask1Contribution
    {
        public int Id { get; set; }
        public int QuestionsId { get; set; }
        public DateTime TimeContributed { get; set; } = DateTime.UtcNow;
    }
}