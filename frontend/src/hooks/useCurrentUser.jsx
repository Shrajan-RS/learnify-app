import { useEffect, useState } from "react";
import { userProfileURI } from "../App";
import axios from "axios";

function useCurrentUser() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        setIsLoading(true);

        const user = await axios.get(`${userProfileURI}/get-current-user`, {
          withCredentials: true,
        });

        setUserData(user.data);
      } catch (error) {
        console.log("Error from the GetCurrentUser Hook: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return { userData, isLoading };
}

export default useCurrentUser;
