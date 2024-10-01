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
        public async Task<IActionResult> PostUser([FromBody] User user) {
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
        public async Task<IActionResult> PostLogin([FromBody] User user) {
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
    }
}