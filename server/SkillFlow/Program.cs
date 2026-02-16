using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SkillFlow.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<SkillFlowDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddControllers();

// Configure CORS to allow our browser/React to talk to the API
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    );
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

app.Run();
