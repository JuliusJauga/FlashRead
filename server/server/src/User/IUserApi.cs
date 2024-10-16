namespace server.UserNamespace {
    public record UserFromAPI(string Email, string Password, string? Username = null);
    public interface IUserApi {
        public static User convertUserFromAPI(UserFromAPI userFromAPI)
        {
            return new User(userFromAPI.Email, userFromAPI.Password, userFromAPI.Username ?? string.Empty);
        }
    }
}