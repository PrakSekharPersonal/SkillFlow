namespace SkillFlow.Models
{
    public class Milestone
    {
        public int Id { get; set; }

        public int LearningPathId { get; set; }

        public string Title { get; set; } = string.Empty;

        public bool IsCompleted { get; set; } = false;
    }
}
