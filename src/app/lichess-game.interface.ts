export interface LichessGameInterface {
    id: string;
    rated: boolean;
    variant: string;
    speed: string;
    perf: string;
    createdAt: number;
    lastMoveAt: number;
    status: string;
    players: {
        white: LichessUserInterface;
        black: LichessUserInterface;
    };
    opening: {
        eco: string;
        name: string;
        ply: number;
    };
    moves: string;
    clock: {
        initial: number;
        increment: number;
        totalTime: number;
    };
}

export interface LichessUserInterface {
    user: {
        name: string;
        title?: string;
        patron?: boolean;
        id: string;
    };
    rating: number;
    ratingDiff: number;
}
