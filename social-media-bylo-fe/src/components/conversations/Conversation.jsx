import axios from "axios";
import React, { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find(
      (m) => m !== currentUser.data._id
    );

    const getUser = async () => {
      try {
        const result = await axios("/users?userId=" + friendId);
        // console.log(result.data);
        setUser(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation, currentUser]);
  return (
    <div className="conversation">
      <img
        src={
          user?.profilePicture
            ? PublicFolder + user.profilePicture
            : PublicFolder + "/person/noavatar.jpg"
        }
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
