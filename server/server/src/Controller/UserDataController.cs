using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class UserDataController : ControllerBase {
        private readonly IUserHandler _userHandler;
        public UserDataController(IUserHandler userHandler) {
            _userHandler = userHandler;
        }
        [HttpPost("Users/Register")]
        public async Task<IActionResult> PostUser([FromBody] UserFromAPI userAPI) {
            var user = convertUserFromAPI(userAPI);
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid user data.");
            }
            var result = await _userHandler.RegisterUserAsync(user);
            if (result)
            {
                return Ok("User added successfully.");
            }
            return StatusCode(500, "An error occurred while adding the user.");
        }
        [HttpPost("Users/Login")]
        public async Task<IActionResult> PostLogin([FromBody] UserFromAPI userAPI) {
            var user = convertUserFromAPI(userAPI);
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid user data.");
            }
            var result = await _userHandler.LoginUserAsync(user);
            if (result)
            {
                return Ok("User logged in successfully.");
            }
            return Unauthorized("Invalid email or password.");
        }
        [HttpPost("Users/All")]
        public async Task<IActionResult> GetAllUsers() {
            var users = await _userHandler.GetAllUsersAsync();
            var usersWithoutPasswords = users.Select(user => new {
            user.Name,
            user.Email,
            });
            return Ok(usersWithoutPasswords);
        }
        public record UserFromAPI(string Email, string Password, string? Username = null);
        private User convertUserFromAPI(UserFromAPI userFromAPI)
        {
            return new User(userFromAPI.Email, userFromAPI.Password, userFromAPI.Username ?? string.Empty);
        }
    }
}