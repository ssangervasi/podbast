import process from "node:process";
import { App } from "@tinyhttp/app";

export const PORT = Number(process.env.PORT) || 42993;

const app = new App();

app.get("/", (req, res) => {
  res.send("hello world 999999");
});

app.get("/debug/?.*", (req, res) => {
  if (process.env.NODE_ENV !== "development") {
    return res.sendStatus(404);
  }

  res.json({
    url: req.url,
  });
});

app.get("/rss/?.*", (req, res) => {
  res.json({
    url: req.url,
  });
});

app.listen(PORT);
console.debug("We still good again");
