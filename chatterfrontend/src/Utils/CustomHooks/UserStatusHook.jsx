import { useEffect, useRef, useState } from "react";
import { apiConnector } from "../../Services/apiConnector";
import { endpoints } from "../../Services/api";
const { CONCURRENT_CHECK_API } = endpoints;

export function useOnlineStatus(token) {
  const [onlineUser, setOnlineUser] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!token) return; // no API calls without a token

    let mounted = true;

    const conn = async () => {
      try {
        const result = await apiConnector(
          "POST",
          CONCURRENT_CHECK_API,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (!result.data.success) {
          throw new Error(result.data.message);
        }

        if (mounted) {
          setOnlineUser(result.data.data);
        }
      } catch (err) {
        console.error(
          "CONCURRENT_CHECK_API ............. ",
          err?.message || err
        );
      }
    };

    // run immediately once
    conn();

    // run every 30 seconds
    intervalRef.current = setInterval(conn, 30_000);

    // cleanup on unmount
    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token]);

  return { onlineUser };
}
