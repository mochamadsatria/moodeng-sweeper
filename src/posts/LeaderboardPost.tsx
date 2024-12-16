import type { Context } from "@devvit/public-api";
import { Devvit, useAsync } from "@devvit/public-api";
import { LeaderboardScreen } from "./Leaderboard/LeaderboardScreen.js";
import { Service } from "../service/Service.js";
import { LeaderboardsPostData, PostId } from "../types.js";
import { LeaderboardLayout } from "../components/LeaderboardLayout.js";
import { PixelText } from "../components/PixelText.js";
import Settings from "../settings.json" assert { type: "json" };

interface LeaderboardsPostProps {
  postId: PostId;
}

export const LeaderboardPost = (
  props: LeaderboardsPostProps,
  context: Context
) => {
  const service = new Service(context);
  const { data, loading } = useAsync<LeaderboardsPostData>(async () => {
    try {
      return await service.getLeaderboardsPostData(props.postId);
    } catch (error) {
      if (error) {
        console.error("Error loading leaderboard data", error);
      }
      return {
        leaderboard: [],
        user: { username: null, rank: -1, score: 0 },
      };
    }
  });

  // Return early view if data is loading
  if (loading || data === null) {
    return (
      <LeaderboardLayout>
        <vstack grow alignment="center middle">
          <PixelText color={Settings.theme.secondary}>Loading ...</PixelText>
        </vstack>
      </LeaderboardLayout>
    );
  }

  return (
    <vstack>
      {data && <LeaderboardScreen postId={props.postId} data={data} />}
    </vstack>
  );
};
