using System.Threading.Tasks;
using BCrypt.Net;
using server.src;
using server.UserNamespace;
using Microsoft.EntityFrameworkCore;
namespace server.UserNamespace {
    public class UserHandler : IUserHandler
    {
        private readonly FlashDbContext _context;
        public UserHandler(FlashDbContext context)
        {
            _context = context;
        }
        public async Task<bool> RegisterUserAsync(User user)
        {
            // Check if user already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.email);
            if (existingUser != null)
            {
                return false;
            }

            var dbUser = new DbUser
            {
                Name = user.name,
                Email = user.email,
                Password = HashPassword(user.password)
            };

            _context.Users.Add(dbUser);
            await _context.SaveChangesAsync();
            return true;
        }
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash) ? true : false;
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
}