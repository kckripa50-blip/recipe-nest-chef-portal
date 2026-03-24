using RecipeNest.Backend.Models;

namespace RecipeNest.Backend.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequest request);
        Task<string> LoginAsync(LoginRequest request);
        Task<User?> GetUserByIdAsync(int userId);
    }
}
