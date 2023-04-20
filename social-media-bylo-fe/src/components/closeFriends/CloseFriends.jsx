import React from "react";
import "./closefriends.css";

export default function CloseFriends({ user }) {
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div>
      <li className="sidebarFriend">
        <img
          src={
            user.profilePicture
              ? PublicFolder + user.profilePicture
              : PublicFolder + "/person/noavatar.jpg"
          }
          alt="friend pic"
          className="sidebarFriendImg"
        />
        <span className="sidebarFriendName">{user.username}</span>
      </li>
    </div>
  );
}
