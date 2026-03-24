using Microsoft.AspNetCore.Http;

namespace RecipeNest.Backend.Services
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
        void DeleteFile(string filePath);
        bool IsValidImage(IFormFile file);
    }
}
