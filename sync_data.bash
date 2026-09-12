#!/usr/bin/env bash

set -e

REMOTE_URL="https://github.com/langningchen/shanghai-textbook-data.git"
CURRENT_DATE=$(date '+%Y-%m-%d')

if [ ! -d "./books" ] || [ -z "$(ls -A ./books 2>/dev/null)" ]; then
  exit 0
fi

TMP_DIR=$(mktemp -d)

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT INT TERM

git clone --filter=blob:none --no-checkout --depth 1 "${REMOTE_URL}" "${TMP_DIR}/repo"

ORIG_DIR=$(pwd)
cd "${TMP_DIR}/repo"

git sparse-checkout set --no-cone '/*' '!/books/*'
git checkout main

mkdir -p books
cp -r --verbose --update=none "${ORIG_DIR}/books/"* books/

CHARS=$(find "${ORIG_DIR}/books" -maxdepth 1 -type f -exec basename {} \; 2>/dev/null | cut -c1 | tr '[:upper:]' '[:lower:]' | grep -E '^[0-9a-f]$' | sort -u)

for char in ${CHARS}; do
  git add --sparse "books/${char}"* 2>/dev/null || true
  if ! git diff --cached --quiet; then
    git commit -m "chore(books): sync prefix ${char} (${CURRENT_DATE})"
  fi
done

if [ -f "books/bookcase.json" ]; then
  git add --sparse books/bookcase.json 2>/dev/null || true
  if ! git diff --cached --quiet; then
    git commit -m "chore(meta): sync bookcase.json (${CURRENT_DATE})"
  fi
fi

COMMITS=$(git rev-list --reverse origin/main..HEAD)
for commit in ${COMMITS}; do
  git push origin "${commit}:refs/heads/main"
  echo "Pushed ${commit:0:7}"
done
