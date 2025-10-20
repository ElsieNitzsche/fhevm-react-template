# Contributing to FHEVM Universal SDK

Thank you for your interest in contributing to the FHEVM Universal SDK! This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- **Be respectful**: Treat everyone with respect
- **Be collaborative**: Work together constructively
- **Be inclusive**: Welcome diverse perspectives
- **Be professional**: Maintain professional conduct

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report:
1. Check the [existing issues](https://github.com/your-repo/issues)
2. Verify the bug is reproducible
3. Collect relevant information

**Bug Report Template:**
```markdown
**Description:**
Brief description of the bug

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. ...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- SDK Version:
- React Version:
- Node Version:
- Browser:

**Additional Context:**
Any other relevant information
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

1. **Use a clear title**
2. **Provide detailed description**
3. **Explain the use case**
4. **Include examples** if applicable

**Enhancement Template:**
```markdown
**Feature Description:**
Clear description of the feature

**Use Case:**
Why this feature is needed

**Proposed Solution:**
How it should work

**Alternatives Considered:**
Other approaches you've considered

**Additional Context:**
Any other relevant information
```

### 📝 Improving Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples
- Improve API documentation
- Create tutorials

### 💻 Code Contributions

We welcome code contributions! Please follow the guidelines below.

---

## Development Setup

### Prerequisites

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **Git**: Latest version

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fhevm-universal-sdk.git
   cd fhevm-universal-sdk
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original/fhevm-universal-sdk.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Build the SDK**
   ```bash
   cd packages/fhevm-sdk
   npm run build
   ```

6. **Run examples**
   ```bash
   # Next.js demo
   cd examples/nextjs-demo
   npm install
   npm run dev

   # Property voting demo
   cd examples/property-voting
   npm install
   npm run dev
   ```

### Verify Setup

```bash
# Build should complete without errors
npm run build

# Type checking should pass
npm run type-check
```

---

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── client.ts       # Main client
│       │   ├── utils.ts        # Utilities
│       │   ├── react/          # React hooks
│       │   └── index.ts        # Exports
│       ├── package.json
│       └── tsconfig.json
│
├── examples/
│   ├── nextjs-demo/            # Next.js example
│   └── property-voting/        # Voting example
│
├── docs/
│   ├── API.md                  # API documentation
│   └── ...
│
└── CONTRIBUTING.md             # This file
```

### Key Directories

- **`packages/fhevm-sdk/src/`**: Core SDK source code
- **`packages/fhevm-sdk/src/react/`**: React hooks
- **`examples/`**: Example applications
- **`docs/`**: Documentation

---

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Strict mode** enabled
- **Proper types** - avoid `any`
- **Document public APIs** with JSDoc

**Example:**
```typescript
/**
 * Encrypt a numeric value
 * @param value - Number to encrypt
 * @param bits - Bit size (8, 16, 32, 64, 128, 256)
 * @returns Encrypted value as Uint8Array
 * @throws {Error} If client is not initialized
 */
async encryptNumber(
  value: number,
  bits: 8 | 16 | 32 | 64 | 128 | 256
): Promise<Uint8Array> {
  // Implementation...
}
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix
```

**Key Rules:**
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Max line length**: 100 characters
- **Naming**:
  - `camelCase` for variables and functions
  - `PascalCase` for classes and types
  - `UPPER_CASE` for constants

### React Guidelines

- **Functional components** preferred
- **Hooks** over class components
- **TypeScript** for props and state
- **Meaningful names** for components

**Example:**
```typescript
interface EncryptButtonProps {
  value: number;
  onEncrypt: (encrypted: Uint8Array) => void;
  disabled?: boolean;
}

export function EncryptButton({
  value,
  onEncrypt,
  disabled = false
}: EncryptButtonProps) {
  const { encryptNumber } = useFHEVM();

  const handleClick = async () => {
    const encrypted = await encryptNumber(value, 8);
    onEncrypt(encrypted);
  };

  return (
    <button onClick={handleClick} disabled={disabled}>
      Encrypt
    </button>
  );
}
```

---

## Testing Guidelines

### Writing Tests

Currently, examples serve as integration tests. We welcome contributions for unit tests!

**Future Test Structure:**
```typescript
describe('FHEVMClient', () => {
  describe('encryptNumber', () => {
    it('should encrypt a number', async () => {
      const client = createFHEVMClient();
      await client.init();

      const encrypted = await client.encryptNumber(42, 8);
      expect(encrypted).toBeInstanceOf(Uint8Array);
    });

    it('should throw if not initialized', async () => {
      const client = createFHEVMClient();

      await expect(
        client.encryptNumber(42, 8)
      ).rejects.toThrow('Client not initialized');
    });
  });
});
```

### Manual Testing

Before submitting a PR:

1. **Test in Next.js example:**
   ```bash
   cd examples/nextjs-demo
   npm run dev
   # Test your changes
   ```

2. **Test in property voting example:**
   ```bash
   cd examples/property-voting
   npm run dev
   # Test your changes
   ```

3. **Test build:**
   ```bash
   cd packages/fhevm-sdk
   npm run build
   # Ensure no errors
   ```

---

## Pull Request Process

### Before Submitting

1. **Update from upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes:**
   - Write code
   - Add/update tests
   - Update documentation

4. **Build and test:**
   ```bash
   npm run build
   npm run lint
   # Test examples
   ```

5. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

### Submitting

1. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Examples work correctly
- [ ] Build passes
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass
2. **At least one maintainer** must approve
3. **All discussions** must be resolved
4. **Documentation** must be updated

### After Approval

- Maintainers will merge your PR
- Your contribution will be in the next release
- You'll be added to contributors list

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code style (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvement
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
feat(client): add encryptAddress method

# Bug fix
fix(react): resolve initialization race condition

# Documentation
docs(api): add examples for decrypt methods

# Breaking change
feat(client)!: change encrypt method signature

BREAKING CHANGE: encrypt() now requires bits parameter
```

### Scope

Common scopes:
- `client`: Core client
- `react`: React hooks
- `utils`: Utility functions
- `types`: Type definitions
- `docs`: Documentation
- `examples`: Example apps

---

## Documentation

### When to Update Documentation

- **New features**: Add to API.md
- **Breaking changes**: Update migration guide
- **Examples**: Update example READMEs
- **Configuration**: Update main README

### Documentation Style

- **Clear and concise**
- **Include examples**
- **Link related topics**
- **Keep it updated**

### Documentation Structure

```markdown
# Feature Name

Brief description

## Usage

\`\`\`typescript
// Example code
\`\`\`

## Parameters

- `param1`: Description
- `param2`: Description

## Returns

Description of return value

## Example

\`\`\`typescript
// Complete example
\`\`\`

## See Also

- [Related Feature](./link.md)
```

---

## Release Process

Releases are handled by maintainers:

1. Version bump following [Semantic Versioning](https://semver.org/)
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to npm (future)

### Semantic Versioning

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

---

## Getting Help

### Questions?

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bugs and features
- **Discord**: [Join our community](#) (if applicable)

### Stuck?

Don't hesitate to ask for help:
1. Comment on your PR
2. Open a discussion
3. Reach out to maintainers

---

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You!

Every contribution makes this project better. Whether it's:
- 🐛 Fixing a typo
- 📝 Improving documentation
- ✨ Adding a feature
- 🔧 Fixing a bug

**Your contribution matters!**

---

**Questions?** Open an issue or discussion on GitHub.

**Last Updated**: 2025-10-24
