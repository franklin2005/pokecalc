# PokeCalc — Skill Registry

## Project Standards

**Source**: `AGENTS.md` (project root)

### Stack
- **Language**: TypeScript
- **Framework**: React (Vite bundler)
- **Styles**: CSS3 native, BEM methodology, rem units (base 10px)
- **Data**: @smogon/calc (damage calculation), PokeAPI (sprites), localStorage (persistence)
- **Mode**: Pokémon Champions (IVs hidden=31, EVs max 32, total 66)

### Code Rules (from AGENTS.md)
- Semantic HTML5
- `let`/`const` only — NEVER `var`
- No `alert`, `confirm`, `prompt` — visual DOM feedback only
- No `innerHTML` — use `createElement` or React rendering
- Prevent default on submit/click events
- Prioritize readable, maintainable, simple code
- All visible text in ENGLISH

### Design System
- **Source**: `design/` folder (DESIGN.md, styles.css, HTML references)
- **Tokens**: Material Design color palette (see styles.css :root)
- **Typography**: Plus Jakarta Sans (headlines), Inter (body), Material Symbols (icons)
- **No-Line Rule**: No 1px solid borders — use tonal layering and surface shifts
- **Glassmorphism**: Semi-transparent surfaces with backdrop blur
- **Responsive**: Mobile-first, breakpoints at 640/768/1024/1280px

### Testing
- **Strict TDD**: ENABLED (Vitest v3.1.4 configured)
- **Runner**: Vitest (`npm test` / `npm run test:watch`)
- **Integration**: @testing-library/react + @testing-library/jest-dom
- **Coverage**: Not configured

---

## Available Skills

### SDD (Spec-Driven Development)
| Skill | Trigger | Description |
|-------|---------|-------------|
| sdd-init | `sdd init`, project setup | Initialize SDD context, detect stack, bootstrap persistence |
| sdd-explore | Investigate ideas before committing | Explore codebase, research APIs, clarify requirements |
| sdd-propose | Create change proposals | Define intent, scope, approach for a change |
| sdd-spec | Write specifications | Requirements + scenarios (Given/When/Then) |
| sdd-design | Technical design | Architecture decisions, data flow, component structure |
| sdd-tasks | Break down into tasks | Implementation checklist from specs + design |
| sdd-apply | Implement tasks | Write code following specs, design, and task breakdown |
| sdd-verify | Validate implementation | Compare implementation against specs and design |
| sdd-archive | Close completed changes | Sync delta specs, archive change artifacts |

### General
| Skill | Trigger | Description |
|-------|---------|-------------|
| branch-pr | Create PRs | PR creation workflow following issue-first enforcement |
| issue-creation | Create GitHub issues | Issue creation workflow |
| judgment-day | `judgment day`, `doble review` | Adversarial dual-review protocol |
| skill-creator | Create new skills | Agent skill creation following spec |
| skill-registry | `update skills`, `skill registry` | Update this registry file |
| go-testing | Go tests, teatest | Go testing patterns (not relevant for this project) |