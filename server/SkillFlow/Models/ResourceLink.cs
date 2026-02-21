namespace SkillFlow.Models
{
    public class ResourceLink
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Url { get; set; } = string.Empty;

        public int LearningPathId { get; set; }
    }
}
