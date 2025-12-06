import type { HTMLAttributes } from "react";

export type ErrorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className" | "id" | "role" | "aria-live"
>;
