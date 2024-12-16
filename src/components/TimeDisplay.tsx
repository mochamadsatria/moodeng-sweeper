import { Devvit } from "@devvit/public-api";
import { PixelText } from "./PixelText.js";

interface TimeDisplayProps {
  time: number;
}

export const TimeDisplay = (props: TimeDisplayProps) => {
  return (
    <hstack gap="small">
      <PixelText>{`${Math.floor(props.time / 60)}`}</PixelText>
      <PixelText>:</PixelText>
      <PixelText>{`${Math.floor(props.time % 60)}`}</PixelText>
    </hstack>
  );
};
