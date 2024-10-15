using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
using System.Security.Claims;
namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class UserDataController : ControllerBase {
        private readonly UserHandler _userHandler;
        public UserDataController(UserHandler userHandler) {
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
            var token = await _userHandler.LoginUserAsync(user);
            if (result)
            {
                return Ok(new { Token = token});
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
            if (result != null)
            {
                return Ok(new { Token = result });
            }
            return Unauthorized("Invalid email or password.");
        }
        [HttpGet("Users/All")]
        public async Task<IActionResult> GetAllUsers() {
            var users = await _userHandler.GetAllUsersAsync();
            var usersWithoutPasswords = users.Select(user => new {
            user.Name,
            user.Email,
            });
            return Ok(usersWithoutPasswords);
        }
        [Authorize]
        [HttpGet("Users/GetLogins")]
        public async Task<IActionResult> GetUser() {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail)) {
                return Unauthorized("Invalid token.");
            }

            var user = await _userHandler.GetUserByEmailAsync(userEmail);
            if (user != null) {
                return Ok(new { Email = user?.Email, Name = user?.Name });
            }
            return NotFound("User not found.");
        }
        [Authorize]
        [HttpPost("Users/CheckAuth")]
        public IActionResult CheckAuth() {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("Invalid token.");
            }
            return Ok("Token is valid.");
        }

        public record UserFromAPI(string Email, string Password, string? Username = null);
        private User convertUserFromAPI(UserFromAPI userFromAPI)
        {
            return new User(userFromAPI.Email, userFromAPI.Password, userFromAPI.Username ?? string.Empty);
        }
        
    }
}