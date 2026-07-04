# Branch Protection and Required Checks

## Status

This document defines the required repository protection settings for Hatid. It does not prove that GitHub settings are already enabled.

## Required protection for `main`

- Require pull request before merging
- Require at least one approval
- Require conversation resolution
- Require branches to be up to date before merging
- Require status checks to pass before merging
- Block force pushes
- Block branch deletion
- Restrict bypass permissions to repository admins only, if needed
- Require signed commits if the team enables signing consistently

## Required checks

The following checks must be required before merge:

- Hatid Quality Gates
- CI
- Verify
- Vercel - hatid-ph, if Vercel remains the deployment preview provider

## Required local commands before PR review

- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run audit:high
- npm audit

## Evidence required before closing branch-protection work

Attach proof from GitHub settings or branch protection rules showing:

- required PR review
- required status checks
- force push disabled
- branch deletion disabled
- conversation resolution enabled

## Production readiness

Branch protection improves repo safety but does not make Hatid production-ready.
