import type { Context, StateSetter } from "@devvit/public-api";
import { Devvit } from "@devvit/public-api";
import { StyledButton } from "../../components/StyledButton.js";

interface StoryScreenProps {
  setScreen: StateSetter<string>;
}

export const StoryScreen = (props: StoryScreenProps, context: Context) => {
  return (
    <zstack width="100%" height="100%" alignment="end bottom">
      <image
        imageHeight={1024}
        imageWidth={2048}
        height="100%"
        width="100%"
        url="story.png"
        description="Background Story"
        resizeMode="cover"
      />

      <vstack padding="large">
        <StyledButton
          width={100}
          appearance="primary"
          height={50}
          onPress={() => {
            props.setScreen("game");
          }}
          leadingIcon="play"
          label="START"
        />
      </vstack>
    </zstack>
  );
};
