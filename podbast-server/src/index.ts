import process from "node:process";
import { App } from "@tinyhttp/app";
import { narrow } from "narrow-minded";

import { app as rssApp } from "./rss.js";

export const PORT = Number(process.env.PORT) || 42993;

const app = new App();

app.use(rssApp);

app.get("/debug", async (req, res) => {
  console.log("/debug requested ");
  if (process.env.NODE_ENV !== "development") {
    console.log("/debug not dev env ");

    return res.sendStatus(404);
  }

  if (!narrow({ url: "string" }, req.query)) {
    console.log("/debug invalid query ");

    return res.sendStatus(400);
  }

  const { url } = req.query;

  const fres = await fetch(url, {
    method: "GET",
    headers: {},
  });

  console.log("/debug fetched", { status: fres.status });

  // url
  res.send(await fres.text());
});

app.get("/", (req, res) => {
  res.send("Index");
});

app.listen(PORT);

console.debug("Listening on", PORT);
