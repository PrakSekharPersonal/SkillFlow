# SkillFlow

SkillFlow is a full-stack web application that helps you visualize and manage your technical learning roadmaps. It provides a dashboard to create, track, and organize your learning paths, ensuring you stay on course with your educational goals.

## Features

- **Visualize Learning Paths**: View all your learning paths in a clean, card-based layout.
- **Create and Manage Paths**: Easily add new learning paths with titles and descriptions.
- **Track Progress**: Mark paths as complete to track your progress.
- **Search and Filter**: Quickly find paths by title or description.
- **Sort Functionality**: Organize your paths by creation date (newest/oldest) or alphabetically.
- **Stats at a Glance**: Dashboard stats show your total paths, newly added paths, and more.
- **Dark/Light Mode**: Toggle between light and dark themes for comfortable viewing.

## Tech Stack

- **Frontend**:
  - React with Vite
  - TypeScript
  - Tailwind CSS
  - Axios for API communication

- **Backend**:
  - ASP.NET Core Web API
  - C#
  - Entity Framework Core
  - PostgreSQL

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SkillFlow
   ```

2. **Configure the database:**
   - Create a new PostgreSQL database.
   - Update the connection string in `server/SkillFlow/appsettings.Development.json`.

3. **Run the backend server:**
   ```bash
   cd server/SkillFlow
   dotnet restore
   dotnet ef database update
   dotnet run
   ```
   The API will be running at `http://localhost:5142`.

4. **Run the frontend client:**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.
