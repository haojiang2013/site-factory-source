#!/bin/bash
# Run this from your machine to push all 12 open source packages
TOKEN="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"
USER="pank770766"  # Change if different

cd opensource

for dir in */; do
  name="${dir%/}"
  echo "=== $name ==="
  cd "$name"

  # Init git
  git init
  git add -A
  git commit -m "Initial commit: open-source calculator"

  # Create repo and push
  curl -s -X POST -H "Authorization: token $TOKEN" -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\",\"private\":false,\"auto_init\":false}" \
    https://api.github.com/user/repos > /dev/null 2>&1

  git remote add origin "https://$TOKEN@github.com/$USER/$name.git"
  git push -u origin main --force 2>&1
  echo "Pushed: https://github.com/$USER/$name"

  cd ..
done
