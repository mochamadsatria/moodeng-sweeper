import type { Context } from "@devvit/public-api";
import { Devvit, useAsync, useState } from "@devvit/public-api";

import { Service } from "../../service/Service.js";
import Settings from "../../settings.json" assert { type: "json" };
import { LeaderboardRow } from "../../components/LeaderboardRow.js";
import { PixelText } from "../../components/PixelText.js";
import { GameSettings, ScoreBoardEntry, UserScore } from "../../types.js";
import { LeaderboardLayout } from "../../components/LeaderboardLayout.js";

interface LeaderboardScreenProps {
  onClose: () => void;
}

const rowCount = 5;
const availableHeight = 418;
const dividerHeight = 10;

export const LevelLeaderboardScreen = (
  props: LeaderboardScreenProps,
  context: Context
): JSX.Element => {
  const service = new Service(context);

  const [userData] = useState<{
    username?: string;
  }>(async () => {
    const [username] = await Promise.all([service.getUserUsername()]);

    return {
      username: username,
    };
  });

  const [gameSettings] = useState<GameSettings>(async () => {
    const gs = await service.getGameSettings();
    return {
      gameSettings: gs,
    } as any;
  });

  const { data, loading } = useAsync<{
    leaderboard: ScoreBoardEntry[];
    user: UserScore;
  }>(async () => {
    try {
      return {
        leaderboard: await service.getScores(rowCount),
        user: await service.getUserScore(userData.username || ""),
      };
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
      <LeaderboardLayout onClose={props.onClose}>
        <vstack grow alignment="center middle">
          <PixelText color={Settings.theme.secondary}>Loading ...</PixelText>
        </vstack>
      </LeaderboardLayout>
    );
  }

  const isUserInTheTop = data.user.rank < rowCount;
  const rowHeight = isUserInTheTop
    ? `${(availableHeight - dividerHeight) / rowCount}px`
    : `${availableHeight / rowCount}px`;

  const numberOfScoresToInclude =
    !loading && data?.user && isUserInTheTop ? 5 : 4;

  const leaderboardRows = data.leaderboard.map((row, index) => {
    if (index >= numberOfScoresToInclude) {
      return null;
    }
    return (
      <LeaderboardRow
        rank={index + 1}
        height={rowHeight}
        name={row.member}
        score={row.score}
        onPress={() =>
          context.ui.navigateTo(`https://reddit.com/u/${row.member}`)
        }
      />
    );
  });

  const footer = (
    <>
      {/* Divider */}
      <vstack>
        <spacer height="4px" />
        <hstack>
          <spacer width="12px" />
          <hstack grow height="2px" backgroundColor={Settings.theme.shadow} />
          <spacer width="12px" />
        </hstack>
        <spacer height="4px" />
      </vstack>

      {/* User */}
      <LeaderboardRow
        rank={data.user.rank}
        height={rowHeight}
        name={userData.username ?? "Unknown"}
        score={data.user.score}
        onPress={() =>
          context.ui.navigateTo(`https://reddit.com/u/${userData.username}`)
        }
      />
    </>
  );

  const onPost = async () => {
    if (!userData.username) {
      context.ui.showToast("Please log in to post");
      return;
    }

    // Add a temporary lock key to prevent duplicate posting.
    // This lock will expire after 20 seconds.
    // If the lock is already set return early.
    const lockKey = `locked:${userData.username}`;
    const locked = await context.redis.get(lockKey);
    if (locked === "true") return;
    const lockoutPeriod = 20000; // 20 seconds
    await context.redis.set(lockKey, "true", {
      nx: true,
      expiration: new Date(Date.now() + lockoutPeriod),
    });

    // The back-end is configured to run this app's submitPost calls as the user
    const post = await context.reddit.submitPost({
      title: "Look at my achievements!",
      subredditName: gameSettings.subredditName,
      preview: (
        <LeaderboardLayout onClose={props.onClose} onPost={onPost}>
          {leaderboardRows}
          {/* Append the user to the bottom if they are out of view */}
          {!isUserInTheTop && footer}
        </LeaderboardLayout>
      ),
    });

    service.storeLeaderboardsPostData({
      postId: post.id,
      data: data,
      postType: "leaderboard",
    });

    context.ui.navigateTo(post);
  };

  return (
    <LeaderboardLayout onClose={props.onClose} onPost={onPost}>
      {leaderboardRows}
      {/* Append the user to the bottom if they are out of view */}
      {!isUserInTheTop && footer}
    </LeaderboardLayout>
  );
};
