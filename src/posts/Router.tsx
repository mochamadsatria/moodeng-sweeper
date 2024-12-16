import type { Context } from "@devvit/public-api";
import { Devvit, useState } from "@devvit/public-api";
import { Service } from "../service/Service.js";
import { LeaderboardPost } from "./LeaderboardPost.js";
import { PinnedPost } from "./PinnedPost.js";

import {
  PostType,
  PostId,
  LeaderboardsData,
  LeaderboardsPostData,
  LevelPostData,
  PinnedPostData,
  GameSettings,
  UserData,
} from "../types.js";

export const Router: Devvit.CustomPostComponent = (context: Context) => {
  const postId = context.postId as PostId;
  const service = new Service(context);

  const [data] = useState<{
    gameSettings: GameSettings;
    postType: PostType;
  }>(async () => {
    const [postType, gameSettings] = await Promise.all([
      service.getPostType(postId),
      service.getGameSettings(),
    ]);

    return {
      gameSettings,
      postType,
    };
  });

  const postTypes: Record<string, JSX.Element> = {
    leaderboard: <LeaderboardPost postId={postId} />,
    pinned: <PinnedPost />,
  };

  return (
    <zstack width="100%" height="100%" alignment="top start">
      <image
        imageHeight={1024}
        imageWidth={2048}
        height="100%"
        width="100%"
        url="cover.png"
        description="Moodeng Sweeper background"
        resizeMode="cover"
      />
      {postTypes[data.postType] || (
        <vstack alignment="center middle" grow>
          <text>Error: Unknown post type</text>
        </vstack>
      )}
    </zstack>
  );
};
