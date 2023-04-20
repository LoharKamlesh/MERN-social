import "./topbar.css";
import { Chat, Notifications, Person, Search } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// import Post from "../post/Post";

export default function Topbar({ socket }) {
  const { user } = useContext(AuthContext);
  // console.log(user);
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  // console.log(notifications);

  const displayNotification = ({ senderName, type }) => {
    let action;

    if (type === 1) {
      action = "liked";
    } else {
      action = "loved";
    }
    return (
      <span className="notification">{`${senderName} ${action} your post.`}</span>
    );
  };
  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">ByloSocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="search for friends, posts or videos"
            className="searchInput"
          ></input>
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <span className="topbarLink">Homepage</span>
          </Link>

          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person className="personIcon" sx={{ color: "white" }} />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Link to="/messenger" style={{ textDecoration: "none" }}>
              <Chat classname="chatIcon" sx={{ color: "white" }} />

              <span className="topbarIconBadge">1</span>
            </Link>
          </div>
          <div className="topbarIconItem" onClick={() => setOpen(!open)}>
            <Notifications className="notificationIcon" />
            {notifications.length > 0 && (
              <div className="counter">{notifications.length}</div>
            )}
          </div>
          {open && (
            <div className="notifications">
              {notifications.map((n) => displayNotification(n))}
              <button className="nButton" onClick={handleRead}>
                Mark as read
              </button>
            </div>
          )}
        </div>

        <Link to={`/profile/${user.data.username}`}>
          <img
            src={
              user.data.profilePicture
                ? PublicFolder + user.data.profilePicture
                : PublicFolder + "/person/noavatar.jpg"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
