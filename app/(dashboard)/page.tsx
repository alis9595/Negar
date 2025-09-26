"use client";

import { useOrganization } from "@clerk/nextjs";
import EmptyOrg from "./_content/empty/EmptyOrg";
import BoardList from "./_content/list/BoardList";

export default function HomePage() {
  const { organization } = useOrganization();
  return (
    <main className="relative flex flex-1 p-6 ">
      {!organization ? <EmptyOrg /> : <BoardList orgId={organization.id} />}
    </main>
  );
}
