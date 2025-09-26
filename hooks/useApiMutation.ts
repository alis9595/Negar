import { useMutation } from "convex/react";
import { FunctionReference } from "convex/server";
import { useState } from "react";

export const useApiMutation = (
  mutationFunction: FunctionReference<"mutation">
) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = (payload: any) => {
    setPending(true);
    return apiMutation(payload)
      .then((res) => res)
      .catch((err) => {
        throw err;
      })
      .finally(() => setPending(false));
  };
  return { mutate, pending };
};
