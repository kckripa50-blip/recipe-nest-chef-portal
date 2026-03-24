using System.ComponentModel.DataAnnotations;

namespace RecipeNest.Backend.Models
{
    public class RegisterRequest
    {
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
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public bool IsChef { get; set; } = false;

        [MaxLength(1000)]
        public string? Bio { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }
    }
}
