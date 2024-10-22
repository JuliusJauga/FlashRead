namespace server.UserNamespace {
    public class DbUser {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string[] HistoryIds { get; set; } = new string[0];
        public string[] ContributionsIds { get; set; } = new string[0];
        public string SettingsId { get; set; } = null!;
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public string SessionsId { get; set; } = null!;

        public static explicit operator User(DbUser dbUser)
        {
            return new User(dbUser.Email, dbUser.Password, dbUser.Name);
        }
    }
}