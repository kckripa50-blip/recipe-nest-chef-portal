using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace RecipeNest.Backend.Services
{
    public class FileService : IFileService
    {
        private readonly IConfiguration _configuration;
        private readonly string _uploadsFolder;

        public FileService(IConfiguration configuration)
        {
            _configuration = configuration;
            _uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            
            // Ensure the uploads folder exists
            if (!Directory.Exists(_uploadsFolder))
            {
                Directory.CreateDirectory(_uploadsFolder);
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            if (!IsValidImage(file))
            {
                throw new Exception("Invalid file type. Only JPG, PNG, and GIF files are allowed.");
            }

            if (file.Length > 5 * 1024 * 1024) // 5MB limit
            {
                throw new Exception("File size too large. Maximum size is 5MB.");
            }

            var targetFolder = Path.Combine(_uploadsFolder, folder);
            if (!Directory.Exists(targetFolder))
            {
                Directory.CreateDirectory(targetFolder);
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(targetFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{folder}/{fileName}";
        }

        public void DeleteFile(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return;

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath.TrimStart('/'));
            
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }

        public bool IsValidImage(IFormFile file)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            return allowedExtensions.Contains(fileExtension) && 
                   file.ContentType.StartsWith("image/");
        }
    }
}
