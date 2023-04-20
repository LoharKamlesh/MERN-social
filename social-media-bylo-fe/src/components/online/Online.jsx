import { useEffect, useState } from "react";
import "./online.css";
// import { useParams } from "react-router-dom";
import axios from "axios";

export default function Online({ user }) {
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  const [userFriends, setUserFriends] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${user._id}`);
      setUserFriends(res);
    };

    fetchUser();
  }, [user]);

  return (
    <div>
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <img
            src={
              userFriends.data?.profilePicture
                ? PublicFolder + userFriends.data?.profilePicture
                : PublicFolder + "/person/noavatar.jpg"
            }
            alt=""
            className="rightbarProfileImg"
          />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{userFriends.data?.username}</span>
      </li>
    </div>
  );
}
