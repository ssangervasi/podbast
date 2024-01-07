import { Player } from "/src/features/player";
import { Rss } from "/src/features/rss";

export const Home = () => {
  return (
    <div>
      <Rss />
      <Player />
    </div>
  );
};
