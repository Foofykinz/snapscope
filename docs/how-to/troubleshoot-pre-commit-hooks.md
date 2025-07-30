# Pre-commit Hook Troubleshooting Guide

This guide covers common pre-commit hook failures and their solutions for the SnapScope project.

## Quick Fix Summary

The most common issue is ESLint/Prettier formatting errors. Run `pnpm lint:fix` to auto-fix most problems.

## Common Failures & Solutions

### 1. ESLint/Prettier Issues

**Symptom**: `prettier/prettier` errors during commit

```
error  Insert `⏎`  prettier/prettier
```

**Fix**:

```bash
pnpm lint:fix
```

**Prevention**: Configure your IDE to format on save

### 2. Missing Dependencies

**Symptom**: `command not found: eslint` or similar errors

**Fix**:

```bash
pnpm install
```

**Check**: Verify `node_modules/.bin/` directory exists

### 3. TypeScript Configuration Issues

**Symptom**: `project: './tsconfig.json'` parsing errors

**Fix**:

- Verify tsconfig.json paths match monorepo structure
- Ensure all referenced tsconfig files exist

**Check**:

```bash
pnpm typecheck
```

### 4. Monorepo Path Resolution

**Symptom**: Import resolver failures across packages

**Fix**: Update `import/resolver` settings in ESLint config to include all package paths

**Check**: Verify `packages/*/tsconfig.json` paths are correctly configured

### 5. Husky Not Installed

**Symptom**: Git hooks don't run at all

**Fix**:

```bash
pnpm prepare
```

**Check**: Verify `.husky/` directory exists with executable scripts

### 6. Permission Issues

**Symptom**: `Permission denied` on hook execution

**Fix**:

```bash
chmod +x .husky/pre-commit
```

### 7. Performance Issues

**Symptom**: Slow or hanging commits in large repositories

**Fix**:

- Add specific file patterns to lint-staged config
- Use `--cache` flags in ESLint configuration

**Optimize**: Consider limiting lint-staged to only changed files

## Diagnostic Commands

### Test lint-staged directly

```bash
pnpm exec lint-staged
```

### Test hooks manually

```bash
.husky/pre-commit
```

### Reset hooks completely

```bash
rm -rf .husky && pnpm prepare
```

### Check ESLint configuration

```bash
pnpm lint --debug
```

### Verify TypeScript setup

```bash
pnpm typecheck
```

## Configuration Files

The pre-commit hook relies on these key files:

- `.husky/pre-commit` - Hook script
- `package.json` - lint-staged configuration
- `.eslintrc.js` - ESLint rules
- `tsconfig.json` - TypeScript configuration

## Emergency Bypass

If you need to commit urgently and can't fix the hook:

```bash
git commit --no-verify -m "emergency commit"
```

**⚠️ Warning**: Only use `--no-verify` in emergencies. Fix the underlying issue afterward.

## Prevention Tips

1. **IDE Setup**: Configure your editor to format on save
2. **Local Testing**: Run `pnpm lint` before committing
3. **Regular Updates**: Keep dependencies updated with `pnpm update`
4. **Clean Installs**: Periodically run `pnpm clean && pnpm install`
