@echo off
cd opensource
for /d %%d in (*) do (
    echo === %%d ===
    cd %%d
    git init
    git add -A
    git commit -m "Initial commit: open-source calculator"
    gh repo create haojiang2013/%%d --public --source=. --remote=origin --push
    cd ..
    echo Done: https://github.com/haojiang2013/%%d
)
