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
        return CreatedAtAction(nameof(GetPaths), new { id = path.Id }, responseDto);
    }

    // PUT: api/learningpaths/{id} - Use IActionResult as we are not returning any content, just status codes.
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePath(int id, CreateLearningPathDto updateDto)
    {
        // Find the existing record in the database
        var path = await this.dbContext.LearningPaths.FindAsync(id);
        if (path == null)
        {
            return NotFound();
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
}
