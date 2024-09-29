using System;
using System.Threading.Tasks;
using Xunit;
using server.src;
using server.UserNamespace;
using Microsoft.EntityFrameworkCore;

namespace server.Tests
{
    public class UserHandlerTests
    {
        private readonly FlashDbContext _context;
        private readonly UserHandler _userHandler;

        public UserHandlerTests()
        {
            var options = new DbContextOptionsBuilder<FlashDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new FlashDbContext(options);
            _userHandler = new UserHandler(_context);
        }

        [Fact]
        public async Task RegisterUserAsync_ValidUser_ReturnsTrue()
        {
            // Arrange
            var user = new User("John Doe", "john.doe@example.com", "password123");

            // Act
            var result = await _userHandler.RegisterUserAsync(user);

            // Assert
            Assert.True(result);
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.email);
            Assert.NotNull(dbUser);
        }

        [Fact]
        public async Task RegisterUserAsync_SaveChangesFails_ReturnsFalse()
        {
            // Arrange
            var user = new User("John Doe", "john.doe@example.com", "password123");

            // Use a derived context class to simulate failure
            var options = new DbContextOptionsBuilder<FlashDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            var failingContext = new FailingFlashDbContext(options);
            var userHandlerWithFailingContext = new UserHandler(failingContext);

            // Act
            var result = await userHandlerWithFailingContext.RegisterUserAsync(user);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task RegisterUserAsync_UserAlreadyExists_ReturnsFalse()
        {
            // Arrange
            var user = new User("John Doe", "john.doe@example.com", "password123");
            user.password = _userHandler.HashPassword(user.password);
            var dbUser = new DbUser
            {
                Name = user.name,
                Email = user.email,
                Password = user.password
            };
            _context.Users.Add(dbUser);
            await _context.SaveChangesAsync();

            // Act
            var result = await _userHandler.RegisterUserAsync(user);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void HashPassword_ValidPassword_ReturnsHashedPassword()
        {
            // Arrange
            var password = "password123";

            // Act
            var hashedPassword = _userHandler.HashPassword(password);

            // Assert
            Assert.NotNull(hashedPassword);
            Assert.NotEqual(password, hashedPassword);
        }

        [Fact]
        public void VerifyPassword_ValidPassword_ReturnsTrue()
        {
            // Arrange
            var password = "password123";
            var hashedPassword = _userHandler.HashPassword(password);

            // Act
            var result = _userHandler.VerifyPassword(password, hashedPassword);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void VerifyPassword_InvalidPassword_ReturnsFalse()
        {
            // Arrange
            var password = "password123";
            var hashedPassword = _userHandler.HashPassword(password);

            // Act
            var result = _userHandler.VerifyPassword("wrongpassword", hashedPassword);

            // Assert
            Assert.False(result);
        }
    }

    // Derived context class to simulate failure
    public class FailingFlashDbContext : FlashDbContext
    {
        public FailingFlashDbContext(DbContextOptions<FlashDbContext> options)
            : base(options)
        {
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            throw new Exception("Database error");
        }
    }
}