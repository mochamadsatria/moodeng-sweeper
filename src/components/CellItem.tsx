import { Devvit, StateSetter } from "@devvit/public-api";
import { Cell, CellData } from "../types.js";
import { PixelText } from "./PixelText.js";
import Settings from "../settings.json" assert { type: "json" };
import { PixelSymbol } from "./PixelSymbol.js";

type CellProps = {
  isRevealed: boolean;
  type: Cell;
  value?: number;
  setCells: StateSetter<CellData[]>;
  index: number;
  setScreen: StateSetter<string>;
};

export const CellItem = ({
  isRevealed = false,
  type,
  value,
  setCells,
  index,
  setScreen,
}: CellProps) => {
  const gridSize = 9;

  const revealCells = () => {
    setCells((oldValue) => {
      // Clone the old value to avoid mutating the original state directly
      const newCells = [...oldValue];

      const revealCellRecursively = (index: number) => {
        // If the cell is already revealed, skip it
        if (newCells[index].isRevealed) return;

        // Mark the current cell as revealed
        newCells[index] = {
          ...newCells[index],
          isRevealed: true,
        };

        // If the cell is not empty, stop recursion
        if (newCells[index].type !== "EMPTY") return;

        // Get row and column of the current cell
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        // Explore all 8 surrounding cells
        const directions = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ];

        directions.forEach(([dx, dy]) => {
          const newRow = row + dx;
          const newCol = col + dy;

          // Ensure the new coordinates are within bounds
          if (
            newRow >= 0 &&
            newRow < gridSize &&
            newCol >= 0 &&
            newCol < gridSize
          ) {
            const newIndex = newRow * gridSize + newCol;
            revealCellRecursively(newIndex);
          }
        });
      };

      // Start the recursive reveal from the clicked cell
      revealCellRecursively(index);

      return newCells;
    });
  };

  switch (type) {
    case Cell.BOMB:
      return (
        <vstack
          alignment="top center"
          width={"30px"}
          height={"30px"}
          padding="small"
          cornerRadius="small"
          border="thick"
          onPress={() => {
            setScreen("result");
          }}
          backgroundColor={isRevealed ? "#ff9a9a" : Settings.theme.primary}
        >
          {isRevealed ? (
            <PixelSymbol
              scale={2}
              type={"poop"}
              color={Settings.theme.primary}
            />
          ) : (
            <vstack></vstack>
          )}
        </vstack>
      );

    case Cell.NUMBER:
      return (
        <hstack
          alignment="top center"
          width={"30px"}
          height={"30px"}
          padding="small"
          cornerRadius="small"
          border="thick"
          onPress={revealCells}
          backgroundColor={isRevealed ? "#dfdfdf" : Settings.theme.primary}
        >
          {isRevealed ? (
            <PixelText scale={2}>{`${value}`}</PixelText>
          ) : (
            <vstack></vstack>
          )}
        </hstack>
      );

    case Cell.EMPTY:
    default:
      return (
        <vstack
          alignment="top center"
          width={"30px"}
          height={"30px"}
          padding="small"
          cornerRadius="small"
          border="thick"
          onPress={revealCells}
          backgroundColor={isRevealed ? "#dfdfdf" : Settings.theme.primary}
        ></vstack>
      );
  }
};
