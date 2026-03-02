using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddTargetDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "TargetDate",
                table: "LearningPaths",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetDate",
                table: "LearningPaths");
        }
    }
}
