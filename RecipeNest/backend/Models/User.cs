using System.ComponentModel.DataAnnotations;

namespace RecipeNest.Backend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ProfileImageUrl { get; set; }

        public bool IsChef { get; set; } = false;

        [MaxLength(1000)]
        public string? Bio { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        [MaxLength(500)]
        public string? FacebookUrl { get; set; }

        [MaxLength(500)]
        public string? InstagramUrl { get; set; }

        [MaxLength(500)]
        public string? TwitterUrl { get; set; }

        [MaxLength(500)]
        public string? WebsiteUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}
