"use client";

import {
  shallow,
  useOthersConnectionIds,
  useOthersMapped,
} from "@liveblocks/react";
import { memo } from "react";
import Cursor from "./Cursor";
import { Path } from "./layers/Path";
import { rgbToHex } from "@/lib/utils";

interface Props {}

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <>
          <Cursor connectionId={connectionId} key={connectionId} />
        </>
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      pencilColor: other.presence.pencilColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft)
          return (
            <Path
              key={key}
              points={other.pencilDraft}
              fill={other.pencilColor ? rgbToHex(other.pencilColor) : "#000"}
              x={0}
              y={0}
            />
          );

        return null;
      })}
    </>
  );
};

export const CursorsPresence = memo(({}: Props) => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorPresence";

export default CursorsPresence;
