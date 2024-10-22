namespace server.UserNamespace {
    public class DbTaskHistory
    {
        public string Id { get; set; } = null!;
        public uint SessionId { get; set; } = 0;
        public int TaskId { get; set; } = 0;
        public int[] Answers { get; set; } = new int[0];
        public DateTime TimePlayed { get; set; } = DateTime.UtcNow;
    }
}