export enum Cell {
    BOMB = "BOMB",
    EMPTY = "EMPTY",
    NUMBER = "NUMBER",
}

export type ScoreBoardEntry = {
    member: string;
    score: number;
    description?: string;
};

export type CommentId = `t1_${string}`;
export type UserId = `t2_${string}`;
export type PostId = `t3_${string}`;
export type SubredditId = `t5_${string}`;

export enum PostType {
    LEADERBOARDS = 'leaderboards',
    PINNED = 'pinned',
}

export type UserData = {
    score: number;
    lastAttempt: number;
};

export type GameSettings = {
    subredditName: string;
};

export type PinnedPostData = {

}

export type LeaderboardsPostData = {
    leaderboard: ScoreBoardEntry[];
    user: UserScore;
}

export type LevelPostData = any

export type LeaderboardsData = Pick<LevelPostData, 'postId' | 'data'>;


export type CellData = {
    value?: number;
    type: Cell;
    isRevealed?: boolean;
};

export type UserScore = {
    username: string | null;
    rank: number;
    score: number;
}