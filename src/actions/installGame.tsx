import type { MenuItem } from "@devvit/public-api";
import { Devvit } from "@devvit/public-api";

import { LoadingState } from "../components/LoadingState.js";
import { Service } from "../service/Service.js";
import Settings from "../settings.json" assert { type: "json" };

export const installGame: MenuItem = {
  label: "[Moodeng Sweeper] Install game",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const { ui, reddit } = context;
    const service = new Service(context);
    const community = await reddit.getCurrentSubreddit();

    // Create a pinned post
    const post = await reddit.submitPost({
      title: Settings.pinnedPost.title,
      subredditName: community.name,
      preview: <LoadingState />,
    });

    await Promise.all([
      // Pin the post
      post.sticky(),
      // Store the post data
      service.savePinnedPost(post.id),
      // Store the game settings
      service.storeGameSettings({
        subredditName: community.name,
      }),
    ]);

    ui.navigateTo(post);
    ui.showToast("Installed Moodeng Sweeper!");
  },
};
