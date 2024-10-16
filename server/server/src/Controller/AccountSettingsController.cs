using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
using System.Security.Claims;
using server.Models;

namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class AccountSettingsController : ControllerBase {
        private readonly UserHandler _userHandler;
        public AccountSettingsController(UserHandler userHandler) {
            _userHandler = userHandler;
        }
        // TO DO When settings added

        private static Settings _settings = new Settings { Theme = "Olive", Font = "Poppins" };

        [HttpPost("GetSettings")]
        public ActionResult<Settings> GetSettings() {
            Console.WriteLine($"Theme: {_settings.Theme}, Font: {_settings.Font}");
            return Ok(_settings);
        }

        [HttpPost("UpdateSettings")]
        public ActionResult UpdateSettings([FromBody] Settings settings) {
            _settings.Theme = settings.Theme;
            _settings.Font = settings.Font;
            return NoContent();
        }   
    }
}