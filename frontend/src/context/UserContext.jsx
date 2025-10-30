import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { userProfileURI } from "../App";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${userProfileURI}/get-current-user`, {
        withCredentials: true,
      });
      setUserData(res.data || null);
    } catch (err) {
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const value = {
    userData,
    setUserData,
    isLoading,
    getCurrentUser, 
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);