using SkillFlow.Models;

namespace SkillFlow.Dtos
{
    // This is what we send to the React frontend. It can be different from the LearningPath model, which is what we store in the database.
    // This ensures that we have a clear separation between our DB models and the data we expose through our API, allowing us to change one without affecting the other.
    // For example, we might want to add a new field to the LearningPath model in the future, but we don't want to break the API contract with the frontend.
    public record LearningPathDto(
        int Id,
        string Title,
        string? Description,
        DateTime CreatedAt,
        bool IsCompleted,
        List<Milestone> Milestones,
        List<ResourceLink> ResourceLinks
    );

    // This is what we receive from the React frontend.
    public record CreateLearningPathDto(string Title, string? Description, bool IsCompleted);
}
