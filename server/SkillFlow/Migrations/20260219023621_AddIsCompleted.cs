using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddIsCompleted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "LearningPaths",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "LearningPaths");
        }
    }
}
