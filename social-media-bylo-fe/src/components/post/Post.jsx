import "./post.css";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// import { Users } from "../../dummydata";

export default function Post({ post, socket, curUser }) {
  const [like, setLike] = useState(post.likes.length);
  // const [love, setLove] = useState(post.loves.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [user, setUser] = useState({});
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  const likeHandler = async (type) => {
    console.log(post.userId);
    try {
      await axios.patch("/posts/" + post._id + "/like", {
        userId: currentUser.data._id,
      });
      setLike(isLiked ? like - 1 : like + 1);

      type === 1 && setIsLiked(!isLiked);
      !isLiked &&
        socket?.emit("sendNotification", {
          senderName: curUser.data.username,
          receiverId: post.userId,
          type,
        });
    } catch (err) {
      console.log(err);
    }
  };

  const loveHandler = async (type) => {
    try {
      await axios.patch("/posts/" + post._id + "/like", {
        userId: currentUser.data._id,
      });
      setLike(isLoved ? like - 1 : like + 1);

      type === 2 && setIsLoved(!isLoved);
      socket.emit("sendNotification", {
        senderName: curUser.data.username,
        receiverId: post.userId,
        type,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser.data._id));
  }, [currentUser.data._id, post.likes]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PublicFolder + user.profilePicture
                    : PublicFolder + "/person/noavatar.jpg"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PublicFolder + "/" + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={
                isLiked
                  ? `${PublicFolder}/post/like.png`
                  : `${PublicFolder}/post/liked.jpg`
              }
              onClick={() => likeHandler(1)}
              alt=""
            />
            <img
              className="likeIcon"
              src={
                isLoved
                  ? `${PublicFolder}/post/hearted.jpg`
                  : `${PublicFolder}/post/heart.jpg`
              }
              // onClick={likeHandler}
              onClick={() => loveHandler(2)}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
