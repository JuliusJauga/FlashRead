using System.Threading.Tasks;
using BCrypt.Net;
using server.src;
using server.UserNamespace;
using Microsoft.EntityFrameworkCore;
namespace server.UserNamespace {
    public class UserHandler(FlashDbContext _context, TokenProvider tokenProvider)
    {
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
            await createSettingsId(dbUser);
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
        public async Task<string> LoginUserAsync(User user)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (dbUser == null)
            {
                throw new Exception("User not found");
            }
            
            if (!VerifyPassword(user.Password, dbUser.Password))
            {
                throw new Exception("Invalid password");
            }

            string token = tokenProvider.Create(user);

            return token;
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
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            UserCollection users = new UserCollection();
            var userList = await _context.Users.ToListAsync();
            foreach (var dbUser in userList)
            {
                users.Add((User)dbUser);
            }
            return users;
        }
        public async Task<User?> GetUserAsync(User user)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (dbUser == null)
            {
                return null;
            }
            return (User)dbUser;
        }
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (dbUser == null)
            {
                return null;
            }
            return (User)dbUser;
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
        public async Task<string?> GetSettingsIdByEmailAsync(string email) {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (dbUser == null)
            {
            return null;
            }
            return dbUser.SettingsId;
        }
        private async Task createSettingsId(DbUser dbUser)
        {
            DbUserSettings userSettings = new DbUserSettings();
            userSettings.Id = Guid.NewGuid().ToString();
            _context.UserSettings.Add(userSettings);
            var firstTheme = await _context.SettingsThemes.FirstOrDefaultAsync();
            if (firstTheme != null)
            {
                userSettings.Theme = firstTheme.Theme;
            }
            dbUser.SettingsId = userSettings.Id;
            await _context.SaveChangesAsync();
        }
    }
}