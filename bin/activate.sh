source $(dirname "$BASH_SOURCE")/env.sh

nvm use $(cat "$PB_ROOT"/.nvmrc)

alias npr='npm run'
alias pm2='npx pm2'
alias pm='pm2'

app() {
  cd "$PB_APP"
}

server() {
  cd "$PB_SERVER"
}

dev() {
  npm run dev
}

cy() {
  app
  npm run cypress:open
}
