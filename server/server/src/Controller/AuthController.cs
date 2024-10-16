using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
using System.Security.Claims;
namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class AuthController : ControllerBase {
        private readonly UserHandler _userHandler;
        public AuthController(UserHandler userHandler) {
            _userHandler = userHandler;
        }
        [HttpPost("Users/Register")]
        public async Task<IActionResult> PostUser([FromBody] UserFromAPI userAPI) {
            var user = IUserApi.convertUserFromAPI(userAPI);
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
            var user = IUserApi.convertUserFromAPI(userAPI);
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
    }
}