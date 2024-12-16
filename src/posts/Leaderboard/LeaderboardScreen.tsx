import type { Context } from "@devvit/public-api";
import { Devvit } from "@devvit/public-api";

import Settings from "../../settings.json" assert { type: "json" };
import { LeaderboardRow } from "../../components/LeaderboardRow.js";
import { LeaderboardsPostData } from "../../types.js";
import { LeaderboardLayout } from "../../components/LeaderboardLayout.js";

interface LeaderboardScreenProps {
  postId: string;
  data: LeaderboardsPostData;
}

const rowCount = 5;
const availableHeight = 418;
const dividerHeight = 10;

export const LeaderboardScreen = (
  props: LeaderboardScreenProps,
  context: Context
): JSX.Element => {
  const data = props.data;

  const isUserInTheTop = data.user.rank < rowCount;
  const rowHeight = isUserInTheTop
    ? `${(availableHeight - dividerHeight) / rowCount}px`
    : `${availableHeight / rowCount}px`;

  const numberOfScoresToInclude = data?.user && isUserInTheTop ? 5 : 4;

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
        name={data.user.username ?? "Unknown"}
        score={data.user.score}
        onPress={() =>
          context.ui.navigateTo(`https://reddit.com/u/${data.user.username}`)
        }
      />
    </>
  );

  return (
    <LeaderboardLayout>
      {leaderboardRows}
      {/* Append the user to the bottom if they are out of view */}
      {!isUserInTheTop && footer}
    </LeaderboardLayout>
  );
};
