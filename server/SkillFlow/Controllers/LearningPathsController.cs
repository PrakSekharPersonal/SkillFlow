using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillFlow.Data;
using SkillFlow.Dtos;
using SkillFlow.Models;

namespace SkillFlow.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LearningPathsController : ControllerBase
{
    private readonly SkillFlowDbContext dbContext;

    public LearningPathsController(SkillFlowDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    // GET: api/learningpaths - Use ActionResult as we are returning a list of paths.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LearningPathDto>>> GetPaths()
    {
        var paths = await this
            .dbContext.LearningPaths.OrderBy(p => p.Id)
            .Select(p => new LearningPathDto(
                p.Id,
                p.Title,
                p.Description,
                p.CreatedAt,
                p.IsCompleted,
                p.Milestones,
                p.ResourceLinks
            ))
            .ToListAsync();

        return Ok(paths);
    }

    // GET: api/learningpaths/{id} - Use ActionResult to return the path or a 404 if not found.
    [HttpGet("{id}")]
    public async Task<ActionResult<LearningPathDto>> GetPath(int id)
    {
        var path = await this
            .dbContext.LearningPaths.Include(p => p.Milestones)
            .Include(p => p.ResourceLinks)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (path == null)
            return NotFound();

        // Map Model to Dto for sending the response to the frontend
        var pathDto = new LearningPathDto(
            path.Id,
            path.Title,
            path.Description,
            path.CreatedAt,
            path.IsCompleted,
            path.Milestones,
            path.ResourceLinks
        );
        return Ok(pathDto);
    }

    // POST: api/learningpaths - Use ActionResult to return the created resource.
    [HttpPost]
    public async Task<ActionResult<LearningPathDto>> CreatePath(CreateLearningPathDto createDto)
    {
        // Map Dto to Model
        var path = new LearningPath
        {
            Title = createDto.Title,
            Description = createDto.Description,
            IsCompleted = createDto.IsCompleted || false,
        };

        // Save to database
        this.dbContext.LearningPaths.Add(path);
        await this.dbContext.SaveChangesAsync();

        // Map Model back to Dto for sending the response to the frontend
        var responseDto = new LearningPathDto(
            path.Id,
            path.Title,
            path.Description,
            path.CreatedAt,
            path.IsCompleted,
            path.Milestones,
            path.ResourceLinks
        );

        // Return 201 Created with the new resource
        return CreatedAtAction(nameof(GetPath), new { id = path.Id }, responseDto);
    }

    // POST: api/learningpaths/{id}/milestones - Use ActionResult to return the created milestone.
    [HttpPost("{id}/milestones")]
    public async Task<ActionResult<Milestone>> AddMilestone(int id, Milestone milestone)
    {
        var pathExists = await this.dbContext.LearningPaths.AnyAsync(p => p.Id == id);
        if (!pathExists)
            return NotFound("Learning path not found.");

        milestone.LearningPathId = id;
        this.dbContext.Milestones.Add(milestone);
        await this.dbContext.SaveChangesAsync();

        return Ok(milestone);
    }

    // POST: api/learningpaths/{id}/resourcelinks - Use ActionResult to return the created resource link.
    [HttpPost("{id}/resourcelinks")]
    public async Task<ActionResult<ResourceLink>> AddResourceLink(int id, ResourceLink resourceLink)
    {
        var pathExists = await this.dbContext.LearningPaths.AnyAsync(p => p.Id == id);
        if (!pathExists)
            return NotFound("Learning path not found.");

        resourceLink.LearningPathId = id;
        this.dbContext.ResourceLinks.Add(resourceLink);
        await this.dbContext.SaveChangesAsync();

        return Ok(resourceLink);
    }

    // PUT: api/learningpaths/{id} - Use IActionResult as we are not returning any content, just status codes.
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePath(int id, CreateLearningPathDto updateDto)
    {
        // Find the existing record in the database
        var path = await this
            .dbContext.LearningPaths.Include(p => p.Milestones)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (path == null)
            return NotFound();

        // Check if the user is transitioning the path from Active to Completed or vice versa.
        bool isNewlyCompleted = !path.IsCompleted && updateDto.IsCompleted;
        bool isBeingReopened = path.IsCompleted && !updateDto.IsCompleted;
        if (isNewlyCompleted || isBeingReopened)
        {
            // If reopening, mark all milestones as incomplete. If completing, mark all milestones as complete.
            foreach (var milestone in path.Milestones)
            {
                milestone.IsCompleted = isNewlyCompleted;
            }
        }

        // Update the fields
        path.Title = updateDto.Title;
        path.Description = updateDto.Description;
        path.IsCompleted = updateDto.IsCompleted;

        // Save changes to the database
        try
        {
            await this.dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // This handles cases where two people try to update the same row at the exact same time
            return Conflict("The record was modified by another user.");
        }

        return NoContent();
    }

    [HttpPut("{id}/milestones/{milestoneId}")]
    public async Task<IActionResult> UpdateMilestone(int id, int milestoneId, Milestone milestone)
    {
        // Check if the milestone exists and if it belongs to the correct path
        var existingMilestone = await this.dbContext.Milestones.FindAsync(milestoneId);
        if (existingMilestone == null || existingMilestone.LearningPathId != id)
            return NotFound("Milestone not found.");

        // Update the milestone status
        existingMilestone.IsCompleted = milestone.IsCompleted;
        await this.dbContext.SaveChangesAsync();

        // Re-evaluate if the parent path should be marked as completed or not based on the status of all its milestones
        var path = await this
            .dbContext.LearningPaths.Include(p => p.Milestones)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (path != null && path.Milestones.Count != 0)
        {
            // Are all milestones completed?
            bool allComplete = path.Milestones.All(m => m.IsCompleted);

            // If the path's current state doesn't match the new reality, flip it!
            if (path.IsCompleted != allComplete)
            {
                path.IsCompleted = allComplete;
                await this.dbContext.SaveChangesAsync();
            }
        }

        return NoContent();
    }

    // DELETE: api/learningpaths/{id} - Use IActionResult as we are not returning any content, just status codes.
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePath(int id)
    {
        // Find the existing record in the database
        var path = await this.dbContext.LearningPaths.FindAsync(id);
        if (path == null)
        {
            return NotFound();
        }

        // Delete the record
        this.dbContext.LearningPaths.Remove(path);
        await this.dbContext.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/learningpaths/{id}/milestones/{milestoneId} - Use IActionResult as we are not returning any content, just status codes.
    [HttpDelete("{id}/milestones/{milestoneId}")]
    public async Task<IActionResult> DeleteMilestone(int id, int milestoneId)
    {
        // Check if the milestone exists and if it belongs to the correct path
        var existingMilestone = await this.dbContext.Milestones.FindAsync(milestoneId);
        if (existingMilestone == null || existingMilestone.LearningPathId != id)
        {
            return NotFound("Milestone not found for this path.");
        }

        // Delete the milestone
        this.dbContext.Milestones.Remove(existingMilestone);
        await this.dbContext.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/learningpaths/{id}/resourcelinks/{resourceLinkId} - Use IActionResult as we are not returning any content, just status codes.
    [HttpDelete("{id}/resourcelinks/{resourceLinkId}")]
    public async Task<IActionResult> DeleteResourceLink(int id, int resourceLinkId)
    {
        // Check if the resource link exists and if it belongs to the correct path
        var existingResourceLink = await this.dbContext.ResourceLinks.FindAsync(resourceLinkId);
        if (existingResourceLink == null || existingResourceLink.LearningPathId != id)
        {
            return NotFound("Resource link not found for this path.");
        }

        // Delete the resource link
        this.dbContext.ResourceLinks.Remove(existingResourceLink);
        await this.dbContext.SaveChangesAsync();

        return NoContent();
    }
}
