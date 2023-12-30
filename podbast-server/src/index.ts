import process from "node:process";
import { App } from "@tinyhttp/app";

export const PORT = Number(process.env.PORT) || 42993;

const app = new App();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT);
