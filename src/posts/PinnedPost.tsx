import type { Context } from "@devvit/public-api";
import { Devvit, useState } from "@devvit/public-api";
import { StyledButton } from "../components/StyledButton.js";
import { Level } from "./Level/Level.js";
import { LevelLeaderboardScreen } from "./Level/LeaderboardScreen.js";

interface PinnedPostProps {}

export const PinnedPost = (props: PinnedPostProps, ctx: Context) => {
  const [screen, setScreen] = useState("menu");

  const routeMap = [
    {
      label: "Play",
      onPress: () => setScreen("level"),
      leadingIcon: "play",
    },
    {
      label: "Leaderboard",
      onPress: () => setScreen("leaderboard"),
      leadingIcon: "leaderboard",
    },
  ];

  const Menu = (
    <vstack
      width={"100%"}
      height={"100%"}
      alignment={"end middle" as any}
      gap="small"
    >
      {routeMap.map((route) => (
        <vstack key={route.label}>
          <StyledButton
            width={100}
            appearance="primary"
            height={50}
            onPress={route.onPress}
            leadingIcon={route.leadingIcon as any}
            label={route.label}
          />
        </vstack>
      ))}
    </vstack>
  );

  const pages: Record<string, JSX.Element> = {
    menu: Menu,
    // "how-to-play": <HowToPlayPage onClose={onClose} />,
    leaderboard: <LevelLeaderboardScreen onClose={() => setScreen("menu")} />,
    level: <Level />,
  };

  return pages[screen] || Menu;
};
