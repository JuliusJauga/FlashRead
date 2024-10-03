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
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return false;
            }
            var dbUser = convertUserToDbUser(user);
            dbUser.Password = HashPassword(dbUser.Password);
            try
            {
                _context.Users.Add(dbUser);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
            return true;
        }
        public async Task<bool> LoginUserAsync(User user)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (dbUser == null)
            {
                return false;
            }
            return VerifyPassword(user.Password, dbUser.Password);
        }
        public async Task<bool> DeleteUserAsync(User user)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (dbUser == null)
            {
                return false;
            }
            try
            {
                _context.Users.Remove(dbUser);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
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
        private DbUser convertUserToDbUser(User user)
        {
            return (DbUser)user;
        }

    }
    public interface IUserHandler
    {
        Task<bool> RegisterUserAsync(User user);
        Task<bool> LoginUserAsync(User user);
        Task<bool> DeleteUserAsync(User user);
    }
}