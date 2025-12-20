import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useToken = () => {
  const { token } = useSelector((state: RootState) => state.user.data);

  return token;
};
