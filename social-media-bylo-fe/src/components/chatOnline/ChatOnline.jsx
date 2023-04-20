import axios from "axios";
import React, { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({
  onlineUsers,
  currentUserId,
  setCurrentChat,
}) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  // console.log(currentUserId);

  useEffect(() => {
    const getFriends = async () => {
      const result = await axios.get("/users/friends/" + currentUserId);
      // console.log(result);
      setFriends(result.data);
    };
    getFriends();
  }, [currentUserId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `/conversation/find/${currentUserId}/${user._id}`
      );

      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              src={
                o?.profilePicture
                  ? PublicFolder + o.profilePicture
                  : PublicFolder + "/person/noavatar.jpg"
              }
              alt=""
              className="chatOnlineImg"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineUsername">{o.username}</span>
        </div>
      ))}
    </div>
  );
}
