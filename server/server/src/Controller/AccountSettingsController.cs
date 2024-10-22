using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
using System.Security.Claims;
using server.src.Settings;
namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class AccountSettingsController : ControllerBase {
        private readonly UserHandler _userHandler;
        private readonly Settings _settings;
        public AccountSettingsController(UserHandler userHandler, Settings settings) {
            _userHandler = userHandler;
            _settings = settings;
        }
        [Authorize]
        [HttpGet("User/GetThemeSettings")]
        public async Task<IActionResult> GetThemeSettings() {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("Invalid token.");
            }
            var settingsId = await _userHandler.GetSettingsIdByEmailAsync(userEmail);
            if (settingsId == null)
            {
                return NotFound("Settings not found.");
            }
            var theme = await _userHandler.GetSettingsThemeById(settingsId);
            if (theme == null)
            {
                return NotFound("Theme not found.");
            }
            var settings = await _settings.GetSettingsByThemeAsync(theme);
            return Ok(settings);
        }

        [HttpGet("Settings/GetAllThemes")]
        public async Task<IActionResult> GetAllThemes() {
            var themes = await _settings.GetAllThemesAsync();
            return Ok(themes);
        }

        [HttpGet("Settings/GetThemeSettingsByTheme")]
        public async Task<IActionResult> GetThemeSettingsByTheme(string theme) {
            var settings = await _settings.GetSettingsByThemeAsync(theme);
            return Ok(settings);
        }

        [HttpPost("Settings/UpdateTheme")]
        public async Task<IActionResult> UpdateSelectedTheme(string theme) {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail)) {
                return Unauthorized("Invalid token.");
            }
            var settingsId = await _userHandler.GetSettingsIdByEmailAsync(userEmail);
            if (settingsId == null) {
                return NotFound("Settings not found for update.");
            }
            await _settings.UpdateSelectedTheme(settingsId, theme);
            return Ok("Theme updated successfully.");
        }
    }
}