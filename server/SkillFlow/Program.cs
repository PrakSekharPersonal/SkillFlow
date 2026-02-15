using Microsoft.EntityFrameworkCore;
using SkillFlow.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<SkillFlowDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
