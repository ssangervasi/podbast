import { useReducer } from "preact/hooks";

import {
  addSubscription,
  makeReady,
  selectSubscriptionsByStatus,
} from "./slice";
import { useAppDispatch, useAppSelector } from "/src/store";
import { LOCAL_URLS } from "./rssClient";
import { fetchFeed } from "./thunks";
import { Feed } from "/src/features/rss/guards";
import { play } from "/src/features/player/slice";

const FeedViewer = ({ feed }: { feed: Feed }) => {
  const dispatch = useAppDispatch();

  return (
    <div>
      <p>
        <strong>{feed.title}</strong>
      </p>
      <ul style={{ lineHeight: "2.1rem" }}>
        {feed.items.map((fi) => (
          <li>
            <button
              onClick={() => {
                dispatch(
                  play({
                    title: fi.title,
                    url: fi.enclosure.url,
                  })
                );
              }}
            >
              ▶
            </button>
            <span style={{ fontStyle: "italic" }}>{fi.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Rss = () => {
  const dispatch = useAppDispatch();

  const requestedSubs = useAppSelector((state) =>
    selectSubscriptionsByStatus(state, "requested")
  );
  const readySubs = useAppSelector((state) =>
    selectSubscriptionsByStatus(state, "ready")
  );

  const [_, rerender] = useReducer((p) => p + 1, 0);

  return (
    <>
      <div>
        <h1>RSS Stuff</h1>

        <button onClick={() => rerender(0)}>Rerender</button>

        <div>
          <p> Previous URLS:</p>
          <ul>
            {LOCAL_URLS.map((u) => (
              <li key={u}>
                <pre style={{ display: "inline" }}>{u}</pre>

                <button
                  onClick={() => {
                    const inputEl: HTMLInputElement =
                      document.querySelector("input[name=url]")!;
                    inputEl.value = u;
                  }}
                >
                  Use
                </button>
              </li>
            ))}
          </ul>

          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              const urlEl = evt.currentTarget.elements.namedItem("url");
              const url = (urlEl as HTMLInputElement).value;
              dispatch(addSubscription(url));
              const ff = fetchFeed(url);
              console.log("ff", ff);
              dispatch(ff);
            }}
          >
            <input type="text" name="url" placeholder="rss.url.com"></input>
            <button type="submit">Request</button>
          </form>
        </div>

        <h2>Requested</h2>
        <ul>
          {requestedSubs.map((ru) => (
            <li key={ru.url}>
              [{ru.status}] {ru.url}
              <button
                onClick={() => {
                  dispatch(makeReady(ru.url));
                }}
              >
                Make ready
              </button>
            </li>
          ))}
        </ul>

        <h2>Ready</h2>
        <div
          style={{
            maxHeight: "40vh",
            overflowY: "auto",
          }}
        >
          <ul>
            {readySubs.map((ru) => (
              <li key={ru.url}>
                <FeedViewer feed={ru.feed!} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
