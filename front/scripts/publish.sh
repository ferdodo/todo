#!/usr/bin/env bash
# Build the front and push dist/ to a branch of a remote GitHub repository.
set -euo pipefail

FRONT="$(cd "$(dirname "$0")/.." && pwd)"

npm run build

read -r -p "GitHub user (octocat) : " GITHUB_USER
read -r -p "Repository (todo) : " GITHUB_REPO
read -r -p "Branch (gh-pages) : " GITHUB_BRANCH
read -r -s -p "GitHub token (ghp_xxxx) : " GITHUB_PAT
echo

# The PAT goes through git config environment variables: it appears neither
# in the remote URL nor in process arguments.
export GIT_CONFIG_COUNT=1
export GIT_CONFIG_KEY_0="http.https://github.com/.extraheader"
export GIT_CONFIG_VALUE_0="Authorization: Basic $(printf "%s:%s" "$GITHUB_USER" "$GITHUB_PAT" | base64 -w0)"

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

git clone --quiet "https://github.com/$GITHUB_USER/$GITHUB_REPO.git" "$WORKDIR"
cd "$WORKDIR"

if git ls-remote --exit-code --heads origin "$GITHUB_BRANCH" > /dev/null; then
	git checkout --quiet "$GITHUB_BRANCH"
else
	git checkout --quiet --orphan "$GITHUB_BRANCH"
fi

git rm -r --quiet --force --ignore-unmatch .
cp -r "$FRONT/dist/." .
git add --all
git -c user.name="$GITHUB_USER" -c user.email="$GITHUB_USER@users.noreply.github.com" commit --quiet -m "Deploy front"
git push --quiet origin "$GITHUB_BRANCH"

echo "Front published to $GITHUB_USER/$GITHUB_REPO@$GITHUB_BRANCH"
