PB_BIN=$(dirname "$BASH_SOURCE")
export PATH="$PATH:$PB_BIN"

nvm use $(cat "$PB_BIN"/../.nvmrc)

alias npr='npm run'
alias pm2='npx pm2'
alias pm='pm2'
