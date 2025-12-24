import { useSelector } from "react-redux";
import { __, includes, pathSatisfies } from "ramda";
import type { RootState } from "../store";
import type { User } from "@project_goldenrod/shared";

const canCreateGame = pathSatisfies<User["role"], RootState>(
  includes<User["role"]>(__, ["ADMIN", "DM"]),
  ["user", "data", "role"],
);

export const useToken = () => {
  const { token } = useSelector((state: RootState) => state.user.data);

  return token;
};

export const useCanCreateGame = () => useSelector(canCreateGame);

// Idea, numeric role levels for easier comparison
// export const ROLE_LEVELS: Record<User["role"], number> = {
//   ADMIN: 300,
//   DM: 200,
//   PLAYER: 100,
// };
