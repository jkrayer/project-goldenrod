# Shared Package

This package contains shared code used by both the frontend and backend, including:

- **Validation utilities**: Email, username, and other input validation
- **Shared types**: TypeScript interfaces and types used across the application
- **Constants**: Shared configuration values

## Usage

### In Backend

```typescript
import {
  validateEmail,
  validateUsername,
  type User,
} from "@project_goldenrod/shared";

const email = "user@example.com";
if (!validateEmail(email)) {
  throw new Error("Invalid email");
}
```

### In Frontend

```typescript
import { validateEmail, type Game } from "@project_goldenrod/shared";

const isValid = validateEmail(formData.email);
```

## Development

After making changes to the shared package:

```bash
cd shared
npm run build
```

Or use watch mode during development:

```bash
cd shared
npm run watch
```

## Adding New Code

1. Add your code to `src/index.ts` or create new files in `src/`
2. Export from `src/index.ts`
3. Run `npm run build`
4. Use in backend/frontend by importing from `@project_goldenrod/shared`
