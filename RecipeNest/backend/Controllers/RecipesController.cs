using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeNest.Backend.Data;
using RecipeNest.Backend.Models;

namespace RecipeNest.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecipesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRecipes(
            [FromQuery] int? chefId,
            [FromQuery] string? category,
            [FromQuery] string? search,
            [FromQuery] string? sortBy = "name")
        {
            var query = _context.Recipes
                .Include(r => r.Chef)
                .AsQueryable();

            if (chefId.HasValue)
            {
                query = query.Where(r => r.ChefId == chefId.Value);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(r => r.Category == category);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(r => 
                    r.Title.Contains(search) || 
                    r.Description.Contains(search) ||
                    r.Ingredients.Contains(search));
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
                .Where(r => r.IsPublished)
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
                    r.CreatedAt,
                    Chef = new
                    {
                        r.Chef.Id,
                        r.Chef.FirstName,
                        r.Chef.LastName,
                        r.Chef.ProfileImageUrl
                    }
                })
                .ToListAsync();

            return Ok(recipes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.Chef)
                .Where(r => r.Id == id && r.IsPublished)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.Category,
                    r.Difficulty,
                    r.CookingTime,
                    r.Servings,
                    r.Ingredients,
                    r.Instructions,
                    r.ImageUrl,
                    r.Rating,
                    r.LikesCount,
                    r.CreatedAt,
                    Chef = new
                    {
                        r.Chef.Id,
                        r.Chef.FirstName,
                        r.Chef.LastName,
                        r.Chef.Bio,
                        r.Chef.Location,
                        r.Chef.ProfileImageUrl,
                        r.Chef.FacebookUrl,
                        r.Chef.InstagramUrl,
                        r.Chef.TwitterUrl,
                        r.Chef.WebsiteUrl
                    }
                })
                .FirstOrDefaultAsync();

            if (recipe == null)
            {
                return NotFound();
            }

            return Ok(recipe);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateRecipe([FromBody] Recipe recipe)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            recipe.ChefId = int.Parse(userIdClaim.Value);
            recipe.CreatedAt = DateTime.UtcNow;
            recipe.UpdatedAt = DateTime.UtcNow;

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(int id, [FromBody] Recipe recipe)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var existingRecipe = await _context.Recipes.FindAsync(id);
            if (existingRecipe == null)
            {
                return NotFound();
            }

            if (existingRecipe.ChefId != int.Parse(userIdClaim.Value))
            {
                return Forbid();
            }

            existingRecipe.Title = recipe.Title;
            existingRecipe.Description = recipe.Description;
            existingRecipe.Category = recipe.Category;
            existingRecipe.Difficulty = recipe.Difficulty;
            existingRecipe.CookingTime = recipe.CookingTime;
            existingRecipe.Servings = recipe.Servings;
            existingRecipe.Ingredients = recipe.Ingredients;
            existingRecipe.Instructions = recipe.Instructions;
            existingRecipe.ImageUrl = recipe.ImageUrl;
            existingRecipe.IsPublished = recipe.IsPublished;
            existingRecipe.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null)
            {
                return NotFound();
            }

            if (recipe.ChefId != int.Parse(userIdClaim.Value))
            {
                return Forbid();
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
