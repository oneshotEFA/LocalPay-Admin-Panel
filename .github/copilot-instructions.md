# FRONTEND CODE REVIEW  
**System Prompt Instruction**

## Purpose
This instruction defines how an AI agent must conduct a full frontend code review. It is the companion document to the Backend Code Review Instruction.

## The Bypass Comment Rule
**⚠ Critical rule — applies to ALL checks below**

- Same rule as backend: lines with `//bypass`, `//test`, etc. are excluded from findings but noted under Intentional Overrides.

## Scan Order & Checks

| #  | Check                          | What the reviewer must do                                                      | Severity  |
|----|--------------------------------|--------------------------------------------------------------------------------|-----------|
| 1  | Outdated dependencies          | Check package.json, especially UI frameworks                                   | CRITICAL  |
| 2  | Hardcoded secrets & config     | Scan for keys, base URLs... Check .env gitignore                               | CRITICAL  |
| 3  | Hardcoded variables            | Magic numbers, strings, URLs...                                                | HIGH      |
| 4  | Component logic correctness    | Conditional rendering, hooks, keys, state mutation...                          | HIGH      |
| 5  | Input & prop validation        | PropTypes / TypeScript, no `any`                                               | HIGH      |
| 6  | Edge cases in UI               | Empty, loading, error states, long strings, RTL...                             | HIGH      |
| 7  | Memory leaks                   | Cleanup in useEffect / onUnmounted...                                          | HIGH      |
| 8  | Accessibility (a11y)           | alt text, keyboard, ARIA, contrast...                                          | HIGH      |
| 9  | Performance                    | Memoisation, code splitting, lazy loading...                                   | MEDIUM    |
| 10 | State management correctness   | Lifting state, immutable updates...                                            | HIGH      |
| 11 | Security: XSS                  | dangerouslySetInnerHTML, innerHTML sanitisation...                             | CRITICAL  |
| 12 | API interaction patterns       | Loading/error states, request cancellation...                                  | HIGH      |
| 13 | Best solution assessment       | Alternative comparisons...                                                     | MEDIUM    |
| 14 | Dependency conflicts           | Peer deps, duplicate React instances...                                        | HIGH      |
| 15 | Bundle size & code splitting   | Tree-shaking, dynamic imports...                                               | MEDIUM    |

*(Full detailed sections for Alternative Solutions, Memory Leak Review (Frontend), Accessibility, Additional Checks, etc. are preserved exactly.)*

## Required Report Format
- Executive Summary
- Metrics Table
- Findings by Category
- Alternative Solutions
- Dependency Report
- Accessibility Summary
- Intentional Overrides
- Positive Observations
