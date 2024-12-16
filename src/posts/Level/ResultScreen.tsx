import type {
  Context,
  StateSetter,
  UseIntervalResult,
} from "@devvit/public-api";
import { Devvit, useState, useForm } from "@devvit/public-api";
import { CellData } from "../../types.js";
import { PixelText } from "../../components/PixelText.js";
import { TimeDisplay } from "../../components/TimeDisplay.js";
import { Service } from "../../service/Service.js";
import Settings from "../../settings.json" assert { type: "json" };
import { StyledButton } from "../../components/StyledButton.js";

interface ResultScreenProps {
  cells: CellData[];
  elapsedTime: number;
  interval: UseIntervalResult;
  setScreen: StateSetter<string>;
}

export const ResultScreen = (props: ResultScreenProps, context: Context) => {
  const service = new Service(context);

  const [data] = useState<{
    points: number;
    username?: string;
  }>(async () => {
    let newPoints = 0;

    props.cells.map((cell) => {
      if (cell.isRevealed) {
        if (cell.value) {
          newPoints += cell.value;
        }
      }
    });

    newPoints = Math.floor((newPoints * 100) / props.elapsedTime);

    const [username] = await Promise.all([service.getUserUsername()]);

    if (username) {
      await Promise.all([service.incrementUserScore(username, newPoints)]);
    }

    return {
      points: newPoints,
      username: username,
    };
  });

  props.interval.stop();

  const routeMap = [
    // {
    //   label: "Restart Game",
    //   onPress: () => props.setScreen("story"),
    //   leadingIcon: "undo",
    // },
    {
      label: "Leaderboard",
      onPress: () => props.setScreen("leaderboard"),
      leadingIcon: "leaderboard",
    },
  ];

  return (
    <vstack
      alignment="center middle"
      width={"100%"}
      height={"100%"}
      padding="large"
      backgroundColor={Settings.theme.background}
      gap="medium"
    >
      <PixelText>Points:</PixelText>
      <PixelText>{`${data.points}`}</PixelText>

      <PixelText>Elapsed Time:</PixelText>

      <TimeDisplay time={props.elapsedTime} />

      <vstack gap="small">
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
    </vstack>
  );
};
