if (import.meta.env.DEV) {
  import("preact/debug");
}

import { render } from "preact";

import { App } from "./app";

render(<App />, document.getElementById("app")!);
