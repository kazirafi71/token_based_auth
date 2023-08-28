"use client";
import Axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

export default function Home() {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");

  const fetchRefreshToken = async () => {
    try {
      const result = await Axios.get(
        "http://localhost:5000/api/auth/refreshToken",
        { withCredentials: true }
      );

      sessionStorage.setItem("token", result?.data?.data?.accessToken);
    } catch (error: any) {
      setError(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      var decoded: any = jwt_decode(token);
      const dateObject = new Date();
      const dateString = dateObject.toISOString(); // Convert Date to string
      const timestamp = Date.parse(dateString);

      console.log(
        "🚀 ~ file: page.tsx:27 ~ useEffect ~ decoded:",
        timestamp,
        decoded?.exp
      );

      if (timestamp > decoded?.exp) {
        fetchRefreshToken();
      }
    } else {
      fetchRefreshToken();
    }
  }, []);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const result = await Axios.get(
          "http://localhost:5000/api/user/user-list",
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        setUserData(result?.data?.data?.userData);
        console.log(
          "🚀 ~ file: page.tsx:12 ~ fetchUserList ~ result:",
          result?.data
        );
      } catch (error: any) {
        console.log(
          "🚀 ~ file: page.tsx:18 ~ fetchUserList ~ error:",
          error?.response?.data?.message
        );
        setError(error?.response?.data?.message);
      }
    };

    fetchUserList();
  }, []);

  const logoutHandler = async () => {
    try {
      const axiosInstance = Axios.create({
        withCredentials: true,
      });
      const result = await axiosInstance.post(
        "http://localhost:5000/api/auth/logout",
        {
          withCredentials: true,
        }
      );

      sessionStorage.removeItem("token");
    } catch (error: any) {
      setError(error?.response?.data?.message);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <>
      {" "}
      <div>{userData && JSON.stringify(userData)}</div>
      <button onClick={logoutHandler}>Logout</button>
    </>
  );
}
