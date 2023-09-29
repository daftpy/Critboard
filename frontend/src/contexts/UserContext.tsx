import { createContext, ReactNode, useEffect, useState } from "react";
import { getUsers } from "../services/getUsers.ts";

export const UserContext = createContext("Login");

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      setUsername(res.user.username);
    };

    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={username}>{children}</UserContext.Provider>
  );
};
