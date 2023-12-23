import { useMemo, useReducer } from "preact/hooks";
import { createSelectUrlsByStatus, rawSelectUrlsByStatus } from "./selectors";
import { addUrl, makeReady } from "./slice";
import { useAppDispatch, useAppSelector } from "/src/store";

export const Rss = () => {
  // const selectReady = useMemo(() => {
  //   selectSlice;
  // }, []);

  const [_, rerender] = useReducer((p) => p + 1, 0);

  const requestedUrls = useAppSelector((state) => {
    const s = Math.random() > 0.5 ? "requested" : "snorp";
    console.log("s", s, rawSelectUrlsByStatus);
    return rawSelectUrlsByStatus(state, s);
  });
  const readyUrls = useAppSelector((state) =>
    rawSelectUrlsByStatus(state, "ready")
  );
  // const urls = useAppSelector(selectUrls);
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

        <button onClick={() => rerender(0)}>Rerender</button>

        <div>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              const urlEl = evt.currentTarget.elements.namedItem("url");
              const url = (urlEl as HTMLInputElement).value;
              dispatch(addUrl(url));
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
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
