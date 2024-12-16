import type { Context } from "@devvit/public-api";
import { Devvit, useInterval, useState } from "@devvit/public-api";
import { StoryScreen } from "./StoryScreen.js";
import { ResultScreen } from "./ResultScreen.js";
import { GameScreen } from "./GameScreen.js";
import { flattenArray, generateMinesweeperBoard } from "../../utils.js";
import { LevelLeaderboardScreen } from "./LeaderboardScreen.js";

interface LevelScreenProps {}

export const Level = (props: LevelScreenProps, ctx: Context) => {
  const [cells, setCells] = useState(
    flattenArray(generateMinesweeperBoard(9, 9, 10))
  );

  const [paused, setPaused] = useState(false);

  const [timer, setTimer] = useState(0);
  const interval = useInterval(() => {
    setTimer((oldVal) => (oldVal += 1));
  }, 1000);

  if (!paused && timer < 3600) {
    interval.start();
  } else {
    interval.stop();
  }

  const [screen, setScreen] = useState("story");
  const screenTypes: Record<string, JSX.Element> = {
    story: <StoryScreen setScreen={setScreen} />,
    game: (
      <GameScreen
        setScreen={setScreen}
        paused={paused}
        setPaused={setPaused}
        cells={cells}
        setCells={setCells}
        timer={timer}
        interval={interval}
      />
    ),
    result: (
      <ResultScreen
        cells={cells}
        elapsedTime={timer}
        interval={interval}
        setScreen={setScreen}
      />
    ),
    leaderboard: <LevelLeaderboardScreen onClose={() => setScreen("result")} />,
  };

  return (
    <zstack width="100%" height="100%" alignment="top start">
      {screenTypes[screen] || (
        <vstack alignment="center middle" grow>
          <text>Error: Unknown screen type</text>
        </vstack>
      )}
    </zstack>
  );
};
