namespace server.UserNamespace {
    public class DbUserSingleSession
    {
        public string Id { get; set; } = null!;
        public DateTime TimeStarted { get; set; } = DateTime.UtcNow;
        public DateTime TimeEnded { get; set; } = DateTime.UtcNow;
    }
}