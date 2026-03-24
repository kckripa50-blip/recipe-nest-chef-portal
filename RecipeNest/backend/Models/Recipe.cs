using System.ComponentModel.DataAnnotations;

namespace RecipeNest.Backend.Models
{
    public class Recipe
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Difficulty { get; set; } = string.Empty; // Easy, Medium, Hard

        [Required]
        [MaxLength(50)]
        public string CookingTime { get; set; } = string.Empty;

        [Required]
        public int Servings { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Ingredients { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string Instructions { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? ImageUrl { get; set; }

        public bool IsPublished { get; set; } = false;

        public double Rating { get; set; } = 0;

        public int LikesCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int ChefId { get; set; }

        // Navigation property
        public User Chef { get; set; } = null!;
    }
}
