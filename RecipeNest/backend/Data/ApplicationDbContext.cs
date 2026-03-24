using Microsoft.EntityFrameworkCore;
using RecipeNest.Backend.Models;

namespace RecipeNest.Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Recipe> Recipes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.ProfileImageUrl).HasMaxLength(500);
                entity.Property(e => e.Bio).HasMaxLength(1000);
                entity.Property(e => e.Location).HasMaxLength(100);
                entity.Property(e => e.FacebookUrl).HasMaxLength(500);
                entity.Property(e => e.InstagramUrl).HasMaxLength(500);
                entity.Property(e => e.TwitterUrl).HasMaxLength(500);
                entity.Property(e => e.WebsiteUrl).HasMaxLength(500);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Recipe configuration
            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Difficulty).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CookingTime).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Ingredients).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Instructions).IsRequired().HasMaxLength(5000);
                entity.Property(e => e.ImageUrl).HasMaxLength(1000);

                entity.HasOne(r => r.Chef)
                      .WithMany(u => u.Recipes)
                      .HasForeignKey(r => r.ChefId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
