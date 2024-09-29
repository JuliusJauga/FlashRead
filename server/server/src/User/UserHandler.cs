using System.Threading.Tasks;
using BCrypt.Net;
public class UserHandler : IUserHandler
{
    private readonly IDatabaseManager _databaseManager;
    public UserHandler(IDatabaseManager databaseManager)
    {
        // **UNCOMMENT THIS ONCE YOU HAVE CREATED THE DATABASE**
        //DatabaseManager databaseManager = new DatabaseManager("Server=localhost\\SQLEXPRESS01;Database=flash-read-db;Trusted_Connection=True;");
        _databaseManager = databaseManager;
    }
    public async Task<bool> RegisterUserAsync(User user)
    {
        
        user.password = HashPassword(user.password);
        // **UNCOMMENT THIS ONCE YOU HAVE CREATED THE DATABASE**
        return await _databaseManager.AddUserAsync(user);
    }
    private string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

}
public interface IUserHandler
{
    Task<bool> RegisterUserAsync(User user);
}

public record User(string name, string email, string password)
{
    public string password { get; set; } = password;
    public User() : this("John Doe", "example.com", "example") { }
}