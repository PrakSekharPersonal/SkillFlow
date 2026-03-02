using System.ComponentModel.DataAnnotations;

namespace SkillFlow.Models
{
    public class LearningPath
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsCompleted { get; set; } = false;

        public DateTime? TargetDate { get; set; }

        public List<Milestone> Milestones { get; set; } = new();

        public List<ResourceLink> ResourceLinks { get; set; } = new();
    }
}
