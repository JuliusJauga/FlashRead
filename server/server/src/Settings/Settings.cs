using Microsoft.EntityFrameworkCore;
using server.src;
using server.src.Settings;
namespace server.src.Settings {
    public class Settings (FlashDbContext _context){
        public async Task<string?> GetSettingsByIdAsync(string id)
        {
            return "not done";
        }
    }    
}