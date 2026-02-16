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

    // GET: api/learningpaths
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LearningPathDto>>> GetPaths()
    {
        var paths = await this
            .dbContext.LearningPaths.Select(p => new LearningPathDto(
                p.Id,
                p.Title,
                p.Description,
                p.CreatedAt
            ))
            .ToListAsync();

        return Ok(paths);
    }

    // POST: api/learningpaths
    [HttpPost]
    public async Task<ActionResult<LearningPathDto>> CreatePath(CreateLearningPathDto createDto)
    {
        // Map Dto to Model
        var path = new LearningPath
        {
            Title = createDto.Title,
            Description = createDto.Description,
        };

        // Save to database
        this.dbContext.LearningPaths.Add(path);
        await this.dbContext.SaveChangesAsync();

        // Map Model back to Dto for sending the response to the frontend
        var responseDto = new LearningPathDto(
            path.Id,
            path.Title,
            path.Description,
            path.CreatedAt
        );

        // Return 201 Created with the new resource
        return CreatedAtAction(nameof(GetPaths), new { id = path.Id }, responseDto);
    }

    // PUT: api/learningpaths/{id}
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

    // DELETE: api/learningpaths/{id}
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
