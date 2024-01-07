export const Player = () => {
  return (
    <div
      style={{
        height: 120,
        width: "100vw",
        position: "fixed",
        bottom: 0,
        left: 0,
        backgroundColor: "#202535",
        //
        display: "flex",
        flexDirection: "row",
        placeContent: "center",
        placeItems: "center",
      }}
    >
      <div>Player</div>
      <div>
        <button>⏯</button>
        <button>▶</button>
      </div>
    </div>
  );
};
