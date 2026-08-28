# Organization Management

Strict TypeScript implementation of an employee organization hierarchy.

## Commands

```bash
npm install
npm run check
npm run build
```

`npm run check` runs the inline checks in `src/index.ts`. It verifies employee creation, hierarchy validation, reads, updates, deletes, and reportee synchronization.

Employees must be created top-down: CEO, Director, Manager, Lead, then Engineer. An employee cannot be deleted or change designation while they have reportees, and all reporting links are kept synchronized by `Organization`.
