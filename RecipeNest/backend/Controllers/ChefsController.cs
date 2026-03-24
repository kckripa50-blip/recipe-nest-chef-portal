using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.Backend.Data;
using RecipeNest.Backend.Models;

namespace RecipeNest.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChefsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChefsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetChefs([FromQuery] string? search)
        {
            var query = _context.Users
                .Where(u => u.IsChef)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => 
                    u.FirstName.Contains(search) || 
                    u.LastName.Contains(search) ||
                    u.Bio!.Contains(search) ||
                    u.Location!.Contains(search));
            }

            var chefs = await query
                .Select(u => new
                {
                    u.Id,
                    FullName = u.FirstName + " " + u.LastName,
                    u.Bio,
                    u.Location,
                    u.ProfileImageUrl,
                    RecipeCount = _context.Recipes.Count(r => r.ChefId == u.Id && r.IsPublished),
                    Rating = _context.Recipes
                        .Where(r => r.ChefId == u.Id && r.IsPublished)
                        .DefaultIfEmpty()
                        .Average(r => r != null ? r.Rating : 0)
                })
                .ToListAsync();

            return Ok(chefs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetChef(int id)
        {
            var chef = await _context.Users
                .Where(u => u.Id == id && u.IsChef)
                .Select(u => new
                {
                    u.Id,
                    FullName = u.FirstName + " " + u.LastName,
                    u.Bio,
                    u.Location,
                    u.ProfileImageUrl,
                    u.FacebookUrl,
                    u.InstagramUrl,
                    u.TwitterUrl,
                    u.WebsiteUrl,
                    RecipeCount = _context.Recipes.Count(r => r.ChefId == u.Id && r.IsPublished),
                    Rating = _context.Recipes
                        .Where(r => r.ChefId == u.Id && r.IsPublished)
                        .DefaultIfEmpty()
                        .Average(r => r != null ? r.Rating : 0)
                })
                .FirstOrDefaultAsync();

            if (chef == null)
            {
                return NotFound();
            }

            return Ok(chef);
        }

        [HttpGet("{id}/recipes")]
        public async Task<IActionResult> GetChefRecipes(
            int id, 
            [FromQuery] string? category,
            [FromQuery] string? search,
            [FromQuery] string? sortBy = "name")
        {
            var chefExists = await _context.Users.AnyAsync(u => u.Id == id && u.IsChef);
            if (!chefExists)
            {
                return NotFound();
            }

            var query = _context.Recipes
                .Where(r => r.ChefId == id && r.IsPublished)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(r => r.Category == category);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(r => 
                    r.Title.Contains(search) || 
                    r.Description.Contains(search));
            }

            query = sortBy switch
            {
                "name" => query.OrderBy(r => r.Title),
                "time" => query.OrderBy(r => r.CookingTime),
                "difficulty" => query.OrderBy(r => r.Difficulty),
                "rating" => query.OrderByDescending(r => r.Rating),
                _ => query.OrderBy(r => r.Title)
            };

            var recipes = await query
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.Category,
                    r.Difficulty,
                    r.CookingTime,
                    r.Servings,
                    r.ImageUrl,
                    r.Rating,
                    r.LikesCount,
                    r.CreatedAt
                })
                .ToListAsync();

            return Ok(recipes);
        }
    }
}
