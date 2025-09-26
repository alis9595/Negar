"use client";

import { TLayer } from "@/types/canvas";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import { ReactNode } from "react";

export default function Room(props: {
  children: ReactNode;
  roomId: string;
  fallback: ReactNode;
}) {
  return (
    <LiveblocksProvider throttle={16} authEndpoint={"/api/liveblocks-auth"}>
      <RoomProvider
        initialPresence={{
          cursor: null,
          selection: [],
          pencilDraft: null,
          pencilColor: null,
        }}
        id={props.roomId || "my-room"}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<TLayer>>(),
          layerIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense fallback={props.fallback}>
          {props.children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
