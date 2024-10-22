namespace server.UserNamespace {
    public class DbUserSessions
    {
        public string Id { get; set; } = null!;
        public string[] SessionIds { get; set; } = new string[0];
    }
}