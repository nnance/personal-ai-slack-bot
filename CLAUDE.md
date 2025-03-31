# Development Guidelines

## Build & Test Commands
- Build: `npm run build`
- Run tests: `npm run test`
- Run single test: `npm test -- path/to/test.ts`
- Start server: `npm run start`

## Code Style
- TypeScript with strong typing (interfaces for props, return types)
- Interface naming: `PascalCase` with `Props` suffix for component props
- Test files: Same name as source file with `.test.ts` extension
- Function naming: Prefer `camelCase` and descriptive names
- Error handling: Use try/catch with appropriate logging and status codes

## Patterns
- Functional React components with hooks
- Jest for testing with descriptive test names
- Agents use factory pattern (e.g., `createAssistantAgent`)
- Dependency injection for better testability
- Async/await for asynchronous code

## Imports & Organization
- Group imports: 1) External libraries 2) Internal modules
- Import only what's needed using destructuring
- Tests: Import modules under test first, then test utilities