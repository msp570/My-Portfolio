#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/msp570/My-Portfolio.git"
BRANCH="main"

echo "=================================================="
echo "  Deploying Portfolio Website to GitHub"
echo "  Target: $REPO_URL"
echo "=================================================="

# 1. Ensure remote is correctly set
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
  echo "Updating remote origin to $REPO_URL..."
  git remote set-url origin "$REPO_URL" 2>/dev/null || git remote add origin "$REPO_URL"
fi

# 2. Stage all project files
echo "Staging project files..."
git add -A

# 3. Commit changes if any exist
if git diff --staged --quiet; then
  echo "No local changes to commit."
else
  COMMIT_MSG="Update executive portfolio and CV assets: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Committing changes: $COMMIT_MSG"
  git commit -m "$COMMIT_MSG"
fi

# 4. Push to remote repository
echo "Pushing to $REPO_URL ($BRANCH)..."
git push -u origin "$BRANCH"

echo "=================================================="
echo "  Deployment Push Completed Successfully!"
echo "  Repository: https://github.com/msp570/My-Portfolio"
echo "  GitHub Pages: https://msp570.github.io/My-Portfolio/"
echo "=================================================="
