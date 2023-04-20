import {
  Cancel,
  EmojiEmotions,
  Label,
  PermMedia,
  Room,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./share.css";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user.data._id,
      desc: desc.current.value,
    };
    if (file) {
      console.log(file);
      const data = new FormData();
      const fileName = Date.now() + file.name;
      console.log(typeof fileName);
      data.append("name", fileName);
      data.append("file", file);

      newPost.img = fileName;

      try {
        await axios.post("http://localhost:8800/api/v1/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.post("http://localhost:8800/api/v1/posts", newPost);
      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.data.profilePicture
                ? PublicFolder + user.data.profilePicture
                : PublicFolder + "/person/noavatar.jpg"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.data.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Locations</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>

          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
