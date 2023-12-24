import Parser from "rss-parser";

const LOCAL_URLS_VAR = `${import.meta.env.VITE_LOCAL_RSS_FEEDS ?? ""}`;

export const LOCAL_URLS = LOCAL_URLS_VAR.split(/\s+/).filter(
  (u) => u.length && URL.canParse(u)
);

export const getFeed = async (url: string) => {
  console.log("getFeed", url);

  try {
    const parser = new Parser();
    console.log("------------- parser", parser);
  } catch (e) {
    console.error(e);
  }

  console.log({
    parser,
    url,
  });

  try {
    return await parser.parseURL(url);
  } catch (e) {
    console.error("Feed error", e);
    throw e;
  }
};
