# TeamSync Constitution

## Core Principles

### I. TypeScript-First Reliability

All application code must use TypeScript in strict mode. The team will avoid `any` entirely and prefer explicit types, interfaces, and safe data modeling. When uncertainty exists, the code should use precise types or `unknown` rather than weakening type safety.

### II. Tailwind-First UI

TeamSync interfaces should be built with Tailwind CSS using a utility-first approach. Custom CSS should be introduced only when it is genuinely necessary for a reusable pattern, complex visual requirement, or maintainability concern; otherwise, styling should remain in utility classes.

### III. Next.js App Router Discipline

The project will follow Next.js App Router conventions by default. Server components should be used for data fetching and rendering when possible, while client components are reserved for interactivity and browser-only behavior. File-based routing is the standard structure, and route-specific logic should stay close to the relevant route.

### IV. Quality Through Testing

Meaningful features, user flows, and critical logic must be covered by tests. The team should favor unit and component tests for isolated behavior and integration tests for end-to-end workflows that matter to student collaboration. Tests should be added alongside implementation and must pass before changes are considered complete.

### V. Clear, Consistent Naming

Files, folders, components, functions, and variables should use clear, predictable naming. Use lowercase kebab-case for files and folders, PascalCase for components and types, camelCase for variables and functions, and UPPER_SNAKE_CASE only for true constants where appropriate. Names should describe intent rather than implementation details.

### VI. Collaborative, Student-Friendly Delivery

TeamSync should be built in a way that supports clear handoffs and shared ownership. Team members must communicate changes clearly, keep work modular, and leave code understandable for others. Pull requests should be concise, reviewed thoughtfully, and documented when behavior is non-obvious.

## Technical Constraints

TeamSync must be implemented using Next.js with the App Router, TypeScript, and Tailwind CSS. The product should prioritize clarity, responsiveness, maintainability, and effective collaboration for student teams. New dependencies must be justified, keep the stack lean, and be documented when introduced.

## Development Workflow

Work should be broken into small, reviewable increments. Features should be planned before implementation, documented when behavior is complex, and verified locally before merge. Accessibility, responsiveness, and simple maintainability should be considered as part of every change.

## Governance

This constitution supersedes ad hoc practices for TeamSync. Any deviation from these principles must be documented, discussed with the team, and justified in the relevant spec or implementation plan. Amendments require team agreement and an update to this document.

**Version**: 1.0.0 | **Ratified**: 2026-07-10 | **Last Amended**: 2026-07-10
