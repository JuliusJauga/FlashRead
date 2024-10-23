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
        [HttpGet("Users/GetUserDetails")]
        public async Task<IActionResult> GetUserDetails([FromQuery] string email) {
            var user = await _userHandler.GetUserByEmailAsync(email);
            if (user != null) {
                return Ok(new { Email = user?.Email, Name = user?.Name, JoinedAt = user?.JoinedAt });
            }
            return NotFound("User not found.");
        }
        [HttpGet("Users/GetUserHistory")]
        public async Task<IActionResult> GetUserHistory([FromQuery] string email) {
            var user = await _userHandler.GetUserByEmailAsync(email);
            if (user != null) {
                var history = await _userHandler.GetTaskHistoryByEmail(email);
                return Ok(history);
            }
            return NotFound("User not found.");
        }
    }
}