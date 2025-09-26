import List from "./List";
import NewButton from "./NewButton";

export default function Sidebar() {
  return (
    <aside className="h-full w-16 flex flex-col gap-y-4 p-3 start-0 bg-blue-950 text-white">
      <List />
      <NewButton />
    </aside>
  );
}
