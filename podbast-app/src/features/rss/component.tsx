import { useMemo } from "preact/hooks";
import {
  selectors as rssSelectors,
  actions as rssActions,
  selectSlice as rssSelectSlice,
} from "./slice";
import { useAppDispatch, useAppSelector } from "/src/selectors";
// import { createSelector } from "@reduxjs/toolkit";

export const Rss = () => {
  // const selectReady = useMemo(() => {
  //   rssSelectors.selectSlice;
  // }, []);

  const requestedUrls = useAppSelector((state) =>
    rssSelectors.selectUrlsByStatus(state, "requested")
  );
  const readyUrls = useAppSelector((state) =>
    rssSelectors.selectUrlsByStatus(state, "ready")
  );
  // const urls = useAppSelector(rssSelectors.selectUrls);
  const dispatch = useAppDispatch();

  const localUrls = useMemo(
    () =>
      `${import.meta.env.VITE_LOCAL_RSS_FEEDS}`
        .split(/\s/)
        .filter((u) => u.length && URL.canParse(u)),
    []
  );

  return (
    <>
      <div>
        <h1>RSS Stuff</h1>

        <div>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              const urlEl = evt.currentTarget.elements.namedItem("url");
              const url = (urlEl as HTMLInputElement).value;
              dispatch(rssActions.addUrl(url));
            }}
          >
            <input type="text" name="url" placeholder="rss.url.com"></input>
            <button type="submit">Request</button>
          </form>

          <ul>
            {localUrls.map((u) => (
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
                  dispatch(rssActions.makeReady(ru.url));
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
                  dispatch(rssActions.makeReady(ru.url));
                }}
              >
                Make ready
              </button> */}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
