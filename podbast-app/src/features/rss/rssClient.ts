import { narrow } from "narrow-minded";

const LOCAL_URLS_VAR = `${import.meta.env.VITE_LOCAL_RSS_FEEDS ?? ""}`;

export const LOCAL_URLS = LOCAL_URLS_VAR.split(/\s+/).filter(
  (u) => u.length && URL.canParse(u)
);

export const getFeed = async (url: string) => {
  console.log("getFeed", url);

  const proxu = new URL("/api/rss", window.location.origin);
  proxu.searchParams.set("url", url);

  try {
    const res = await fetch(proxu);
    const json = await res.json();

    if (narrow({ content: "object" }, json)) {
      return json.content;
    } else {
      //
      return "No content";
    }
  } catch (e) {
    console.error("Feed error", e);
    throw e;
  }
};

// export const getFeed = async (url: string) => {
//   console.log("getFeed", url);

//   const proxu = new URL("/api/debug", window.location.origin);
//   proxu.searchParams.set("url", url);

//   try {
//     const res = await fetch(proxu);
//     return res.text();
//   } catch (e) {
//     console.error("Feed error", e);
//     throw e;
//   }
// };
