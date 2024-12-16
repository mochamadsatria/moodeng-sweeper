import { Devvit } from "@devvit/public-api";
import { PixelText } from "./PixelText.js";
import { StyledButton } from "./StyledButton.js";

import Settings from "../settings.json" assert { type: "json" };

export const LeaderboardLayout = (props: {
  children: JSX.Element;
  onPost?: () => void;
  onClose?: () => void;
}): JSX.Element => {
  return (
    <vstack width="100%" height="100%">
      <spacer height="24px" />
      <hstack width="100%" alignment="middle">
        <spacer width="24px" />
        <PixelText scale={2.5} color={Settings.theme.primary}>
          Leaderboard
        </PixelText>
        <spacer grow />
        {props.onClose ? (
          <vstack>
            <StyledButton
              appearance="primary"
              label="Close"
              width={100}
              height={50}
              leadingIcon="X"
              onPress={props.onClose}
            />
          </vstack>
        ) : (
          <vstack></vstack>
        )}
        <spacer width="20px" />
      </hstack>
      <spacer height="24px" />

      <hstack grow>
        <spacer width="24px" />
        <zstack alignment="start top" grow>
          {/* Shadow */}
          <vstack width="100%" height="100%">
            <spacer height="4px" />
            <hstack grow>
              <spacer width="4px" />
              <hstack grow backgroundColor={Settings.theme.shadow} />
            </hstack>
          </vstack>

          {/* Card */}
          <vstack width="100%" height="100%">
            <hstack grow>
              <vstack grow backgroundColor="white">
                <spacer height="4px" />
                {props.children}
                <spacer height="4px" />
                {props.onPost ? (
                  <vstack width={"100%"} alignment="middle center">
                    <vstack width={"30%"}>
                      <StyledButton
                        width={100}
                        appearance="primary"
                        height={50}
                        onPress={props.onPost}
                        trailingIcon={"arrow-right"}
                        label={"POST"}
                      />
                    </vstack>
                  </vstack>
                ) : (
                  <vstack></vstack>
                )}
                <spacer height="4px" />
              </vstack>
              <spacer width="4px" />
            </hstack>
            <spacer height="4px" />
          </vstack>
        </zstack>
        <spacer width="20px" />
      </hstack>

      <spacer height="20px" />
    </vstack>
  );
};
