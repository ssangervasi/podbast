export PB_BIN=$(realpath $(dirname "$BASH_SOURCE"))
export PATH="$PATH:$PB_BIN"

export PB_ROOT=$(realpath "$PB_BIN"/..)
export PB_APP="$PB_ROOT"/podbast-app
export PB_SERVER="$PB_ROOT"/podbast-server
