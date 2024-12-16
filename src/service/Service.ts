import type {
  RedditAPIClient,
  RedisClient,
  Scheduler,
  ZRangeOptions,
} from "@devvit/public-api";
import { GameSettings, LeaderboardsData, LeaderboardsPostData, LevelPostData, PinnedPostData, PostId, PostType, ScoreBoardEntry, UserData, UserScore } from "../types.js";

export class Service {
  readonly redis: RedisClient;
  readonly reddit?: RedditAPIClient;
  readonly scheduler?: Scheduler;

  constructor(context: {
    redis: RedisClient;
    reddit?: RedditAPIClient;
    scheduler?: Scheduler;
  }) {
    this.redis = context.redis;
    this.reddit = context.reddit;
    this.scheduler = context.scheduler;
  }


  readonly tags = {
    scores: "default",
  };

  readonly keys = {
    gameSettings: "game-settings",
    postData: (postId: PostId) => `post:${postId}`,
    userScores: `users:${this.tags.scores}`,
    userData: (username: string) => `users:${username}`,
  };

  async getUserUsername() {
    const currentUser = await this.reddit?.getCurrentUser()

    return currentUser?.username
  }

  /*
   * Pixels
   *
   * A sorted set for the in-game currency and scoreboard unit
   * - Member: Username
   * - Score: Number of pixels currently held
   */

  async getScores(maxLength: number = 10): Promise<ScoreBoardEntry[]> {
    const options: ZRangeOptions = { reverse: true, by: "rank" };
    return await this.redis.zRange(this.keys.userScores, 0, maxLength - 1, options);
  }

  async getUserScore(username: string | null): Promise<UserScore> {
    const defaultValue = { username: null, rank: -1, score: 0 };
    if (!username) return defaultValue;
    try {
      const [rank, score] = await Promise.all([
        this.redis.zRank(this.keys.userScores, username),
        // TODO: Remove .zScore when .zRank supports the WITHSCORE option
        this.redis.zScore(this.keys.userScores, username),
      ]);
      return {
        username: username,
        rank: rank === undefined ? -1 : rank,
        score: score === undefined ? 0 : score,
      };
    } catch (error) {
      if (error) {
        console.error("Error fetching user score board entry", error);
      }
      return defaultValue;
    }
  }

  async incrementUserScore(username: string, amount: number): Promise<number> {
    if (this.scheduler === undefined) {
      console.error("Scheduler not available in Service");
      return 0;
    }
    const key = this.keys.userScores;
    const nextScore = await this.redis.zIncrBy(key, username, amount);

    return nextScore;
  }

  /*
   * Post data
   */

  async getPostType(postId: PostId) {
    const key = this.keys.postData(postId);
    const postType = await this.redis.hGet(key, "postType");
    const defaultPostType = "level";
    return (postType ?? defaultPostType) as PostType;
  }

  /*
   * Level Post data
   */

  async getLevelPost(postId: PostId): Promise<LevelPostData> {
    const [postData] = await Promise.all([
      // TODO: Use hMGet to only fetch needed fields when available
      this.redis.hGetAll(this.keys.postData(postId)),
    ]);

    return {
      postId: postId,
      data: JSON.parse(postData.data),
      date: parseInt(postData.date),
      postType: postData.postType,
    };
  }

  /*
   * Game settings
   */

  async storeGameSettings(settings: {
    [field: string]: string;
  }): Promise<void> {
    const key = this.keys.gameSettings;
    await this.redis.hSet(key, settings);
  }

  async getGameSettings(): Promise<GameSettings> {
    const key = this.keys.gameSettings;
    return (await this.redis.hGetAll(key)) as GameSettings;
  }

  /*
   * Leaderboards
   */

  // async getPostDataFromSubredditPosts(
  //   posts: Post[],
  //   limit: number
  // ): Promise<CollectionData[]> {
  //   return await Promise.all(
  //     posts.map(async (post: Post) => {
  //       const postType = await this.getPostType(post.id);
  //       if (postType === "drawing") {
  //         return await this.getDrawingPost(post.id);
  //       }
  //       return null;
  //     })
  //   ).then((results) =>
  //     results
  //       .filter((postData): postData is DrawingPostData => postData !== null)
  //       .slice(0, limit)
  //   );
  // }

  async storeLeaderboardsPostData(data: {
    postId: PostId;
    data: LeaderboardsPostData
    postType: string;
  }): Promise<void> {
    const key = this.keys.postData(data.postId);
    await this.redis.hSet(key, {
      postId: data.postId,
      data: JSON.stringify(data.data),
      postType: data.postType,
    });
  }

  async getLeaderboardsPostData(postId: PostId): Promise<LeaderboardsPostData> {
    const key = this.keys.postData(postId);
    const post = await this.redis.hGetAll(key);
    return JSON.parse(post.data)
  }

  /*
   * Pinned Post
   */

  async savePinnedPost(postId: PostId): Promise<void> {
    const key = this.keys.postData(postId);
    await this.redis.hSet(key, {
      postId,
      postType: "pinned",
    });
  }

  async getPinnedPost(postId: PostId): Promise<PinnedPostData> {
    const key = this.keys.postData(postId);
    const postType = await this.redis.hGet(key, "postType");
    return {
      postId,
      postType: postType ?? "pinned",
    };
  }

  /*
   * User Data and State Persistence
   */

  async saveUserData(
    username: string,
    data: { [field: string]: string | number | boolean }
  ): Promise<void> {
    const key = this.keys.userData(username);
    const stringConfig = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value)])
    );
    await this.redis.hSet(key, stringConfig);
  }

  async getUser(username: string | null): Promise<UserData | null> {
    if (!username) return null;
    const user = await this.getUserScore(username);

    const parsedData: UserData = {
      score: user.score,
      lastAttempt: 0
    };
    return parsedData;
  }

  /*
   * Collect gameplay metrics to improve the game
   */

  //   async emitWordSelectionEvent(data: WordSelectionEvent): Promise<number> {
  //     const key = this.keys.wordSelectionEvents;
  //     return await this.redis.zAdd(key, {
  //       member: JSON.stringify(data),
  //       score: Date.now(),
  //     });
  //   }

  //   async getRecentWordSelectionEvents(
  //     count: number
  //   ): Promise<WordSelectionEvent[]> {
  //     const key = this.keys.wordSelectionEvents;
  //     const data = await this.redis.zRange(key, 0, count - 1, {
  //       reverse: true,
  //       by: "rank",
  //     });
  //     return data.map((value) => JSON.parse(value.member));
  //   }
}
