namespace server.UserNamespace {
    public class DbUser {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Name { get; set; } = null!;

        public static explicit operator User(DbUser dbUser)
        {
            return new User(dbUser.Email, dbUser.Password, dbUser.Name);
        }
    }
}