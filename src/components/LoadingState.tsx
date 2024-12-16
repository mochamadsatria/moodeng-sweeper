import { Devvit } from "@devvit/public-api";

export const LoadingState = (): JSX.Element => (
  <zstack width="100%" height="100%" alignment="top start">
    <image
      url="loading.png"
      description="Loading ..."
      imageHeight={1024}
      imageWidth={2048}
      width="100%"
      height="100%"
      resizeMode="cover"
    />
  </zstack>
);
