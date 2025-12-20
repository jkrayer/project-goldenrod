import { useDispatch } from "react-redux";
import { userSlice } from "./slice";
import type { AppDispatch } from "../store";

const { logout } = userSlice.actions;

const useAppDispatch = () => useDispatch<AppDispatch>();

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return () => dispatch(logout());
};
