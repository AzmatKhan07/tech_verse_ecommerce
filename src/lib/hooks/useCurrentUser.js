import { useAuthUser } from "react-auth-kit";

export const useCurrentUser = () => {
  const user = useAuthUser();
  if (typeof user === "function") {
    return user();
  }
  return user;
};
