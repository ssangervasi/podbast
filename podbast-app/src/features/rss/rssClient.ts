const LOCAL_URLS_VAR = `${import.meta.env.VITE_LOCAL_RSS_FEEDS ?? ""}`;

export const LOCAL_URLS = LOCAL_URLS_VAR.split(/\s+/).filter(
  (u) => u.length && URL.canParse(u)
);

// const getParser = async () => {
//   const { default: Parser } = await import("rss-parser");

//   try {
//     const parser = new Parser();
//     console.log("------------- parser", parser);
//     return parser;
//   } catch (e) {
//     console.error(e);
//     throw e;
//   }
// };

// export const getFeed = async (url: string) => {
//   console.log("getFeed", url);
//   const parser = await getParser();

//   try {
//     return await parser.parseURL(url);
//   } catch (e) {
//     console.error("Feed error", e);
//     throw e;
//   }
// };
export const getFeed = async (url: string) => {
  console.log("getFeed", url);

  try {
    const res = await fetch(url, {
      method: "GET",
    });
    return res.text();
  } catch (e) {
    console.error("Feed error", e);
    throw e;
  }
};
