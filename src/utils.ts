import { Cell, CellData } from "./types.js";

export const splitIntoChunks = (array: Array<any>, chunkSize: number = 9) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

export const generateMinesweeperBoard = (rows: number, cols: number, bombCount: number): CellData[][] => {
    const board: CellData[][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ type: Cell.EMPTY }))
    );

    // Helper function to place bombs randomly
    const placeBombs = () => {
        let bombsPlaced = 0;

        while (bombsPlaced < bombCount) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);

            if (board[row][col].type !== Cell.BOMB) {
                board[row][col] = { type: Cell.BOMB };
                bombsPlaced++;
            }
        }
    };

    // Helper function to calculate the number of bombs nearby
    const calculateNearbyBombs = (row: number, col: number): number => {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1],
        ];

        return directions.reduce((count, [dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;

            if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                board[newRow][newCol].type === Cell.BOMB
            ) {
                count++;
            }
            return count;
        }, 0);
    };

    // Place bombs
    placeBombs();

    // Calculate values for non-bomb cells
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col].type !== Cell.BOMB) {
                const nearbyBombs = calculateNearbyBombs(row, col);
                board[row][col] = nearbyBombs > 0
                    ? { value: nearbyBombs, type: Cell.NUMBER }
                    : { type: Cell.EMPTY };
            }
        }
    }

    return board;
};

export const flattenArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) =>
        Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
};

// // Example usage
// const board = generateMinesweeperBoard(9, 9, 10);
// console.log(board);
