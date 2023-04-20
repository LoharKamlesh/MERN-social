import "./post.css";
import { MoreVert, ThumbUpOutlined } from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// import { Users } from "../../dummydata";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  const likeHandler = () => {
    axios.patch("http://localhost:8800/api/v1/posts/" + post._id + "/like", {
      userId: currentUser.data._id,
    });
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:8800/api/v1/users?userId=${post.userId}`
      );
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
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={
                isLiked
                  ? `${PublicFolder}/post/heart.png`
                  : `${PublicFolder}/post/hearted.jpg`
              }
              onClick={likeHandler}
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
