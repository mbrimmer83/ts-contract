# Contributing to ts-contract

Thank you for your interest in contributing to ts-contract! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/[your-username]/ts-contract.git
   cd ts-contract
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build packages**
   ```bash
   pnpm build
   ```

4. **Run tests**
   ```bash
   pnpm test
   ```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write your code
   - Add or update tests as needed
   - Ensure all tests pass: `pnpm test`
   - Ensure linting passes: `pnpm lint`
   - Ensure type checking passes: `pnpm typecheck`

3. **Create a changeset**
   
   We use [changesets](https://github.com/changesets/changesets) to manage versions and changelogs.
   
   ```bash
   pnpm changeset
   ```
   
   This will prompt you to:
   - Select which packages are affected by your changes
   - Choose the type of version bump (major, minor, or patch)
   - Write a summary of your changes
   
   **Version Bump Guidelines:**
   - **Major**: Breaking changes that require users to update their code
   - **Minor**: New features that are backward compatible
   - **Patch**: Bug fixes and small improvements
   
   The changeset will create a file in `.changeset/` - commit this with your changes.

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   
   **Commit Message Format:**
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `test:` - Test additions or updates
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance tasks

5. **Push and create a pull request**
   ```bash
   git push origin feat/your-feature-name
   ```
   
   Then open a pull request on GitHub.

### Pull Request Process

1. **Automated checks will run**
   - Linting
   - Type checking
   - Tests
   - Build verification

2. **All checks must pass** before the PR can be merged

3. **Code review**
   - At least one approval is required from a maintainer
   - Address any feedback or requested changes

4. **Merge**
   - Once approved and all checks pass, a maintainer will merge your PR

## Release Process

Releases are automated using changesets and GitHub Actions:

1. **When PRs with changesets are merged to `main`**, the Release workflow automatically creates a "Version Packages" PR

2. **The Version Packages PR**:
   - Updates package versions based on changesets
   - Updates CHANGELOG.md files
   - Removes consumed changeset files

3. **When the Version Packages PR is merged**, packages are automatically published to npm and GitHub releases are created

### Pre-releases (Alpha/Beta)

For pre-release versions:

1. **Enter pre-release mode**
   ```bash
   pnpm changeset pre enter alpha
   # or
   pnpm changeset pre enter beta
   ```

2. **Create changesets and merge PRs as normal**
   - All versions will be pre-release versions (e.g., 1.0.0-alpha.0)

3. **Exit pre-release mode** when ready for stable release
   ```bash
   pnpm changeset pre exit
   ```

## Project Structure

```
ts-contract/
├── packages/
│   ├── core/           # Core contract definitions and types
│   └── plugins/        # Built-in plugins
├── apps/
│   └── docs/           # Documentation website
└── .changeset/         # Changeset configuration and files
```

## Code Style

- We use ESLint for linting
- We use Prettier for code formatting
- Run `pnpm lint` to check for issues
- TypeScript strict mode is enabled

## Testing

- Write tests for new features and bug fixes
- Tests use Vitest
- Run `pnpm test` to run all tests
- Aim for good test coverage, but we don't enforce minimums

## Questions?

Feel free to open an issue for:
- Questions about contributing
- Feature requests
- Bug reports
- General discussion

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
