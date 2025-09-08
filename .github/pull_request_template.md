## Pull Request Review Checklist

### Code Quality
- [ ] Code follows project style guidelines (Google Java Style for backend, ESLint/Prettier for frontend)
- [x] Code is readable, maintainable, and uses clear naming
- [ ] ~~No unnecessary or commented-out code~~

### Functionality
- [ ] Code runs as intended and solves the issue/feature described
- [ ] No breaking changes introduced without justification
- [ ] Input validation and error handling are in place

### Testing
- [ ] Unit tests or integration tests cover new/changed logic
- [ ] All existing tests pass
- [ ] Manual testing steps (if any) are described in the PR

### Security & Stability
- [ ] No secrets, credentials, or sensitive data committed
- [ ] SQL queries, API calls, or file operations are safe from injection or misuse
- [ ] Dependencies added are necessary and from trusted sources

### Project Process
- [ ] Branch name and commit messages follow team conventions
- [ ] PR is scoped to a single feature or fix (not overloaded)
- [ ] Documentation, comments, or README updates provided if needed
