import { useReducer } from "preact/hooks";
import { addUrl, makeReady, selectUrlsByStatus } from "./slice";
import { useAppDispatch, useAppSelector } from "/src/store";
import { LOCAL_URLS } from "./rssClient";
import { fetchFeed } from "./thunks";

export const Rss = () => {
  const [_, rerender] = useReducer((p) => p + 1, 0);

  const requestedUrls = useAppSelector((state) =>
    selectUrlsByStatus(state, "requested")
  );
  const readyUrls = useAppSelector((state) =>
    selectUrlsByStatus(state, "ready")
  );
  const dispatch = useAppDispatch();


  return (
    <>
      <div>
        <h1>RSS Stuff</h1>

        <button onClick={() => rerender(0)}>Rerender</button>

        <div>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              const urlEl = evt.currentTarget.elements.namedItem("url");
              const url = (urlEl as HTMLInputElement).value;
              dispatch(addUrl(url));
              const ff = fetchFeed(url);
              console.log('ff', ff)
              dispatch(ff)
            }}
          >
            <input type="text" name="url" placeholder="rss.url.com"></input>
            <button type="submit">Request</button>
          </form>

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
        </div>

        <h2>Requested</h2>
        <ul>
          {requestedUrls.map((ru) => (
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
        <ul>
          {readyUrls.map((ru) => (
            <li key={ru.url}>
              [{ru.status}] {ru.url}
              {/* <button
                onClick={() => {
                  dispatch(makeReady(ru.url));
                }}
              >
                Make ready
              </button> */}

              <pre>
                {JSON.stringify(ru.feed, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
