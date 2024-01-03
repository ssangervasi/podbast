import { App } from "@tinyhttp/app";
import { narrow } from "narrow-minded";
import Parser from "rss-parser";

//
export const app = new App();

const parseRss = async ({ url }: { url: string }) => {
  const parser = new Parser();
  const parsed = await parser.parseURL(url);
  return parsed;
};

app.get("/rss", async (req, res) => {
  if (!narrow({ url: "string" }, req.query)) {
    console.log("/rss invalid query ");

    return res.sendStatus(400);
  }

  const parsed = await parseRss(req.query);

  res.json({
    content: parsed,
  });
});
