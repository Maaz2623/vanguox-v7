import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface Props {
  query: string;
}

export const QueriedData = ({ query }: Props) => {
  const trpc = useTRPC();

  // React Query call using tRPC
  const { data } = useQuery(trpc.messages.getAnalytics.queryOptions({ query }));

  return <div>{JSON.stringify(data)}</div>;
};
