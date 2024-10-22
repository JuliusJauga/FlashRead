using Microsoft.EntityFrameworkCore;
using server.src;
using server.src.Settings;
namespace server.src.Settings {
    public class Settings (FlashDbContext _context) {
        public async Task<DbSettingsTheme> GetSettingsByThemeAsync(string theme)
        {
            var settings = await _context.SettingsThemes.FirstOrDefaultAsync(s => s.Theme == theme);
            if (settings == null)
            {
                throw new Exception("Settings not found");
            }
            return settings;
        }

        public async Task<DbSettingsFont> GetSettingsByFontAsync(string font)
        {
            var settings = await _context.SettingsFonts.FirstOrDefaultAsync(s => s.Font == font);
            if (settings == null)
            {
                throw new Exception("Settings not found");
            }
            return settings;
        }

        public async Task<string[]> GetAllThemesAsync()
        {
            var themes = await _context.SettingsThemes.Select(s => s.Theme).ToArrayAsync();
            return themes;
        }

        public async Task<string[]> GetAllFontsAsync()
        {
            var fonts = await _context.SettingsFonts.Select(s => s.Font).ToArrayAsync();
            return fonts;
        }


        public async Task UpdateSelectedTheme(string userId, string newTheme) {
            var userSettings = await _context.UserSettings.FirstOrDefaultAsync(s => s.Id == userId);
            if (userSettings == null) {
                throw new Exception("User settings not found");
            }
            userSettings.Theme = newTheme;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSelectedFont(string userId, string newFont) {
            var userSettings = await _context.UserSettings.FirstOrDefaultAsync(s => s.Id == userId);
            if (userSettings == null) {
                throw new Exception("User settings not found");
            }
            userSettings.Font = newFont;
            await _context.SaveChangesAsync();
        }
    }    
}