using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeNest.Backend.Services;

namespace RecipeNest.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string folder = "general")
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded." });
                }

                var filePath = await _fileService.UploadFileAsync(file, folder);
                return Ok(new { filePath });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{filePath}")]
        [Authorize]
        public IActionResult DeleteFile(string filePath)
        {
            try
            {
                _fileService.DeleteFile(filePath);
                return Ok(new { message = "File deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
