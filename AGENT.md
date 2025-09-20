## Project Overview

- **Framework:** Next.js for front-end and Hono for backend with D1 sqlite database.
- **Purpose:** Front-end application consuming data from a REST API.
- **Goals:** Create a responsive, well-structured, and maintainable web application that adheres to best practices.

## Project Structure

Organize your project with a clear and logical folder structure. Our project structure:

```
cf-email-handler/
├── pages/           # Next.js project with shadcn and tailwind
    ├── app/         # Next.js app routes and related styles
    ├── components/  # Reusable UI components
    ├── lib/         # Utility functions
    ├── shared       # The Dto and Enums exposed by the backend
├── workers/         # Rest API project
    ├── src/handlers # The rest api handlers
    ├── migrations   # Database migrations
    ├── openapi.yaml # Contains the OpenAPI specification
```

## Must follow

- All the UI related code must be in the pages directory
- All the API related code must be in the workers directory
- When integrating with API, must comply with relavent OpenApi spec located in workers/openapi.yaml
- Never use console.log, instead try to fix the issue.
- Always use bun instead of npm.

## Coding Standards

- **Language:** Use modern TypeScript.
- **Syntax:** Adhere to consistent formatting; use Prettier and ESLint for code linting.
- **Comments:** Write clear comments for complex logic or API integrations.
- **Modularity:** Keep components small and focused on a single responsibility.

## REST API Integration

- **API Calls:** Use a centralized utility function (or custom hook) to handle REST API calls using fetch.
- **Error Handling:** Implement robust error handling and display user-friendly error messages.
- **Async/Await:** Use async/await for asynchronous operations to keep code readable.
- **Environment Variables:** Store API endpoints and keys securely using environment variables.
- **Comply with OpenApi spec:** API call must comply with relavent OpenApi spec create in workers/openapi.yaml

## UI & Component Guidelines

- **Reusability:** Build components that are modular and reusable.
- **Responsive Design:** Ensure that the UI is responsive and accessible across devices and use shadcn.
- **State Management:** Use React hooks (e.g., `useState`, `useEffect`) or joti if needed.
- **Styling:** Use tailwind css for styling.
