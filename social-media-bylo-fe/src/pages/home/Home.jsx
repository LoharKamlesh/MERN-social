import "./home.css";
import React, { Fragment, useContext, useEffect, useState } from "react";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("ws://localhost:8900"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user.data?._id);
    socket?.on("getUsers", (users) => {
      setOnlineUsers(
        user.data?.following.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user, socket]);

  return (
    <Fragment>
      <Topbar socket={socket} />
      <div className="homeContainer">
        <Sidebar />
        <Feed socket={socket} curUser={user} />
        <Rightbar onlineUsers={onlineUsers} currentUserId={user.data?._id} />
      </div>
    </Fragment>
  );
}
