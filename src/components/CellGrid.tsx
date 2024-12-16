import { Devvit, StateSetter } from "@devvit/public-api";
import { splitIntoChunks } from "../utils.js";
import { CellItem } from "./CellItem.js";
import { Cell, CellData } from "../types.js";
import Settings from "../settings.json" assert { type: "json" };

import { Columns } from "@devvit/kit";

interface CellGridProps {
  cells: CellData[];
  setCells: StateSetter<CellData[]>;
  setScreen: StateSetter<string>;
}

export const CellGrid = ({ cells, setCells, setScreen }: CellGridProps) => {
  return (
    <vstack
      padding="medium"
      alignment="center middle"
      width={"100%"}
      height={"100%"}
      backgroundColor={Settings.theme.background}
    >
      <vstack>
        <Columns columnCount={9} gapX="5px" gapY="5px" order="column">
          {cells.map((cell, index) => (
            <vstack key={`cell-${index}`}>
              <CellItem
                isRevealed={cell.isRevealed || false}
                type={cell.type}
                value={cell.value}
                setCells={setCells}
                index={index}
                setScreen={setScreen}
              />
            </vstack>
          ))}
        </Columns>
      </vstack>
    </vstack>
  );
};
