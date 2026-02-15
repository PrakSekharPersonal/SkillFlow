using Microsoft.EntityFrameworkCore;
using SkillFlow.Models;

namespace SkillFlow.Data
{
    public class SkillFlowDbContext : DbContext
    {
        public SkillFlowDbContext(DbContextOptions<SkillFlowDbContext> options)
            : base(options) { }

        public DbSet<LearningPath> LearningPaths => Set<LearningPath>();
    }
}
