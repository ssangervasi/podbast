import { Player } from "/src/features/player";
import { Rss } from "/src/features/rss";

export const Home = () => {
  return (
    <div style={{ minWidth: 400, maxWidth: 1000 }}>
      <Rss />
      <Player />
    </div>
  );
};
