import axios from "axios";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import Topbar from "../../components/topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";
import "./messenger.css";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState(" ");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // const [socket, setSocket] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user.data?._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.data.following.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const result = await axios.get("/conversation/" + user.data?._id);

        setConversations(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const messages = await axios.get("/messages/" + currentChat?._id);

        setMessages(messages.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const message = {
        sender: user.data._id,
        text: newMessage,
        conversationId: currentChat._id,
      };
      const receiverId = currentChat.members.find(
        (member) => member !== user.data._id
      );
      socket.current.emit("sendMessage", {
        senderId: user.data._id,
        receiverId: receiverId,
        text: newMessage,
      });

      const result = await axios.post("/messages/", message);
      setMessages([...messages, result.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />

            {conversations.map((conversation) => (
              <div onClick={() => setCurrentChat(conversation)}>
                <Conversation
                  // key={user.data._id}
                  conversation={conversation}
                  currentUser={user}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <Fragment>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        // key={user.data._id}
                        message={m}
                        own={m.sender === user.data._id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                    }}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    send
                  </button>
                </div>
              </Fragment>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentUserId={user.data._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
