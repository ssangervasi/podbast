PB_BIN=$(realpath $(dirname "$BASH_SOURCE"))
export PATH="$PATH:$PB_BIN"

export PB_ROOT=$(realpath "$PB_BIN"/..)

nvm use $(cat "$PB_ROOT"/.nvmrc)

alias npr='npm run'
alias pm2='npx pm2'
alias pm='pm2'

app() {
  cd "$PB_ROOT"/podbast-app
}

server() {
  cd "$PB_ROOT"/podbast-server
}
