nvm use $(cat $(dirname "$BASH_SOURCE")/../.nvmrc)

alias npr='npm run'
alias pm2='npx pm2'
alias pm='pm2'

alias run='pm2 start --no-daemon'
