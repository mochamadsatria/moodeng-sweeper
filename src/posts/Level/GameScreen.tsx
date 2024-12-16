import type {
  Context,
  StateSetter,
  UseIntervalResult,
} from "@devvit/public-api";
import { Devvit } from "@devvit/public-api";
import { CellGrid } from "../../components/CellGrid.js";
import { TimeDisplay } from "../../components/TimeDisplay.js";
import { PixelText } from "../../components/PixelText.js";
import { StyledButton } from "../../components/StyledButton.js";

interface GameScreenProps {
  setScreen: StateSetter<string>;
  cells: any[];
  setCells: StateSetter<any>;
  paused: boolean;
  setPaused: StateSetter<boolean>;
  timer: number;
  interval: UseIntervalResult;
}

export const GameScreen = (props: GameScreenProps, context: Context) => {
  return (
    <vstack width={"100%"}>
      <hstack gap="large" padding="medium">
        <hstack alignment="start middle">
          <TimeDisplay time={props.timer} />
        </hstack>
        <spacer grow />
        <vstack alignment="start middle">
          {!props.paused ? (
            <StyledButton
              width={100}
              appearance="primary"
              height={50}
              onPress={() => {
                props.setPaused(true);
                props.interval.stop();
              }}
              leadingIcon="pause"
              label="Pause"
            />
          ) : (
            <StyledButton
              width={100}
              appearance="primary"
              height={50}
              onPress={() => {
                props.setPaused(false);
                props.interval.start();
              }}
              leadingIcon="play"
              label="Resume"
            />
          )}
        </vstack>
      </hstack>
      <zstack>
        <CellGrid
          cells={props.cells}
          setCells={props.setCells}
          setScreen={props.setScreen}
        />
        {props.paused && (
          <vstack
            alignment="center middle"
            width={"100%"}
            height={"100%"}
            padding="medium"
          >
            <PixelText>Paused</PixelText>
          </vstack>
        )}
      </zstack>
    </vstack>
  );
};
