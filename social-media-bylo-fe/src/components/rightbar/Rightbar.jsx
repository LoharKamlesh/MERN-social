import "./rightbar.css";

// import ChatOnline from "../chatOnline/ChatOnline";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
// import { Users } from "../../dummydata";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";

export default function Rightbar({ user, onlineUsers, currentUserId }) {
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  // const { user: currentUser, dispatch} = useContext(AuthContext);
  const { user: currentUser } = useContext(AuthContext);
  // const [friends, setFriends] = useState([]);
  // const [onlineFriends, setOnlineFriends] = useState([]);

  const [followed, setFollowed] = useState(
    !currentUser.data.following.includes(user?._id)
  );
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const getFriends = async () => {
  //     try {
  //       const friendList = await axios.get("/users/friends/" + currentUserId);
  //       setFriends(friendList.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getFriends();
  // }, [currentUserId]);

  // useEffect(() => {
  //   setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  // }, [friends, onlineUsers]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.patch("/users/" + user._id + "/unfollow", {
          userId: currentUser.data._id,
        });
        // dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.patch("/users/" + user._id + "/follow", {
          userId: currentUser.data._id,
        });
        // dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (err) {
      console.log(err);
    }
    setFollowed(!followed);
  };
  const handleClickLogout = () => {
    try {
      localStorage.removeItem("user");
      window.location.assign("/");
    } catch (err) {
      console.log(err);
    }
  };

  const HomeRightbar = () => {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get("/users/friends/" + currentUserId);
          setFriends(friendList.data);
        } catch (err) {
          console.log(err);
        }
      };
      getFriends();
    }, []);

    useEffect(() => {
      setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    }, [friends]);
    return (
      <>
        <div className="birthdayContainer">
          <img
            src={`${PublicFolder}/post/gift.png`}
            alt=""
            className="birthdayImg"
          />
          <span className="birthdayText">
            <b>Ravi</b> and <b>2 other friends</b> have their birthday today
          </span>
        </div>
        <img
          src={`${PublicFolder}/post/ad.png`}
          alt=""
          className="rightbarAd"
        />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {/* {currentUser.data.following?.map((u) => (
            <Online
              key={u}
              user={u}
              onlineUsers={onlineUsers}
              currentUserId={currentUserId}
            />
          ))} */}

          {onlineFriends?.map((u) => (
            <Online key={u} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    const [friends, setFriends] = useState([]);
    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get("/users/friends/" + user?._id);
          setFriends(friendList.data);
        } catch (err) {
          console.log(err);
        }
      };
      getFriends();
    }, []);

    // eslint-disable-next-line no-lone-blocks
    return (
      <>
        {user.username !== currentUser.data.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        {user.username === currentUser.data.username && (
          <button className="rightbarFollowButton" onClick={handleClickLogout}>
            Logout
          </button>
        )}

        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City: </span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From: </span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship: </span>
            <span className="rightbarInfoValue">{user.relationship}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends?.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing" key={friend._id}>
                <img
                  src={
                    friend.profilePicture
                      ? PublicFolder + friend.profilePicture
                      : PublicFolder + "/person/noavatar.jpg"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingUsername">
                  {friend.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
