import Room from "@/providers/liveblocks-provider";
import { Canvas } from "./_content/Canvas";
import { Loading } from "@/components/auth/Loading";

type PageProps<T> = {
  params: T;
};

type TBoardPageProps = PageProps<Promise<{ boardId: string }>>;

export default async function BoardPage({ params }: TBoardPageProps) {
  const { boardId } = await params;
  return (
    <Room roomId={boardId} fallback={<Loading />}>
      <Canvas boardId={boardId} />
    </Room>
  );
}
