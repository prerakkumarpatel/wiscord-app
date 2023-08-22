import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Messages from "./Messages";
import IconButton from "@material-ui/core/IconButton";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import firebase from "firebase/app";
import ScrollableFeed from "react-scrollable-feed";

import { FiSend } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import { Picker } from "emoji-mart";
import { RiImageAddLine } from "react-icons/ri";
import FileUpload from "./FileUpload";
import { useLocation } from "react-router-dom";
import "emoji-mart/css/emoji-mart.css";

// import firebase from "../Firebase/Firebase";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  chat: {
    position: "relative",
    height: "calc(100vh - 200px)",
    paddingLeft: "10px",
    paddingBottom: "5px",
    paddingTop: "5px",
  },
  footer: {
    paddingRight: "15px",
    paddingLeft: "15px",
    paddingTop: "10px",
  },
  message: {
    width: "100%",
    color: "white",
  },
  roomName: {
    border: "1px solid #0000004a",
    borderLeft: 0,
    borderRight: 0,
    padding: "15px",
    display: "flex",
    color: "#e5e5e5",
  },
  roomNameText: {
    marginBlockEnd: 0,
    marginBlockStart: 0,
    paddingLeft: "5px",
  },
  iconDesign: {
    fontSize: "1.5em",
    color: "#e5e5e5",
  },
  footerContent: {
    display: "flex",
    backgroundColor: "#303753",
    borderRadius: "5px",
    alignItems: "center",
  },
  inputFile: {
    display: "none",
  },
}));
function UserMessages() {
  const classes = useStyles();
  const params = useParams();
  const location = useLocation();

  // Extract the query parameter(s) from the location.search string
  const queryParams = new URLSearchParams(location.search);

  // Access specific query parameter values
  const receiveremail = queryParams.get("email"); // Replace 'paramName' with your parameter name
  const receivername = queryParams.get("name");
  const [isTyping, setIsTyping] = useState(false);
  //   const [typingUsers, setTypingUsers] = useState([]);

  const [allMessages, setAllMessages] = useState([]);
  //   const [channelName, setChannelName] = useState("");
  const [userNewMsg, setUserNewMsg] = useState("");
  const [emojiBtn, setEmojiBtn] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [file, setFileName] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    const handleTypingStart = () => {
      setIsTyping(true);
    };

    // Event listener for typing end
    const handleTypingEnd = () => {
      setIsTyping(false);
    };

    // Add event listeners to the message input field
    const messageInput = document.getElementById("outlined-basic"); // Add an ID to your message input field
    messageInput.addEventListener("input", handleTypingStart);
    messageInput.addEventListener("blur", handleTypingEnd);

    if (params.id) {
      // Load messages initially

      db.collection("users")
        .doc(currentUser.uid)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          // console.log(snapshot.docs.at(1).data);
          const filteredarray = snapshot.docs.filter((message) => {
            // console.log(
            //   message.data().receiver,
            //   message.data().sender,
            //   params.id
            // );
            return (
              message.data().receiver === params.id ||
              message.data().sender === params.id
            );
          });
          // console.log(filteredarray);
          setAllMessages(
            filteredarray.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
        });
      // .then((snapshot) => {
      //   const newmes = snapshot.docs.filter(
      //     (message) =>

      //       message.receiver === `${params.id}` ||
      //       message.sender === `${params.id}`
      //   );
      //   setAllMessages(
      //     newmes.map((doc) => ({ id: doc.id, data: doc.data() }))
      //   );
      // })
      // .catch((error) => {
      //   console.error("Error loading initial messages:", error);
      // });
      // Listen for real-time updates
      // db.collection("users")
      //   .doc(currentUser.uid)
      //   .collection("messages")
      //   .orderBy("timestamp", "asc")
      //   .onSnapshot((snapshot) => {
      //     const updatedMessages = snapshot.docChanges().map((change) => {
      //       return { id: change.doc.id, data: change.doc.data() };
      //     });

      //     setAllMessages((prevMessages) => {
      //       const mergedMessages = [...prevMessages, ...updatedMessages];
      //       mergedMessages.sort((a, b) => a.data.timestamp - b.data.timestamp);
      //       // mergedMessages.filter(
      //       //   (message) =>
      //       //     message.receiver === `${params.id}` ||
      //       //     message.sender === `${currentUser.id}`
      //       // );
      //       return mergedMessages;
      //     });
      // });
    }

    db.collection("users")
      .doc(currentUser.uid)
      .update({ ...currentUser, isTyping: isTyping })
      .then((res) => {
        console.log("user typing");
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      messageInput.removeEventListener("input", handleTypingStart);
      messageInput.removeEventListener("blur", handleTypingEnd);
    };
  }, [params, isTyping]);
  // useEffect(() => {
  //
  // }, []);
  const sendMsg = (e) => {
    e.preventDefault();
    console.log(userNewMsg, params.id);
    if (userNewMsg && params) {
      const userData = JSON.parse(localStorage.getItem("userDetails"));

      if (userData) {
        const displayName = userData.displayName;
        const typing = userData.isTyping;
        const imgUrl = userData.photoURL;
        const uid = userData.uid;
        const sender = uid;
        const receiver = params.id;
        const likeCount = 0;
        const likes = {};
        const fireCount = 0;
        const fire = {};
        const heartCount = 0;
        const heart = {};
        const postImg = null;
        const obj = {
          text: userNewMsg,
          sender: sender,
          receiver: receiver,
          timestamp: firebase.firestore.Timestamp.now(),
          userImg: imgUrl,
          userName: displayName,
          uid: uid,
          isTyping: typing,
          likeCount: likeCount,
          likes: likes,
          fireCount: fireCount,
          fire: fire,
          heartCount: heartCount,
          heart: heart,
          postImg: postImg,
        };

        db.collection("users")
          .doc(receiver)
          .collection("messages")
          .add(obj)
          .then((res) => {
            console.log("message sent");
          })
          .catch((err) => {
            console.log(err);
          });
        db.collection("users")
          .doc(uid)
          .collection("messages")
          .add(obj)
          .then((res) => {
            console.log("message sent");
          })
          .catch((err) => {
            console.log(err);
          });
      }

      setUserNewMsg("");
      setEmojiBtn(false);
    }
  };

  const addEmoji = (e) => {
    setUserNewMsg(userNewMsg + e.native);
  };

  const openModal = () => {
    setModalState(!modalState);
  };

  const handelFileUpload = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setFileName(e.target.files[0]);
      openModal();
    }
    e.target.value = null;
  };

  return (
    <div className={classes.root}>
      {modalState ? <FileUpload setState={openModal} file={file} /> : null}
      <Grid item xs={12} className={classes.roomName}>
        <h3 className={classes.roomNameText}>
          {" "}
          To : {receiveremail} ( {receivername} )
        </h3>
      </Grid>
      <Grid item xs={12} className={classes.chat}>
        <ScrollableFeed>
          {allMessages.map((message) => (
            <Messages
              key={message.id}
              values={message.data}
              msgId={message.id}
              msgType={"users"}
            />
          ))}
        </ScrollableFeed>
      </Grid>
      <div className={classes.footer}>
        <Grid item xs={12} className={classes.footerContent}>
          <input
            accept="image/*"
            className={classes.inputFile}
            id="icon-button-file"
            type="file"
            onChange={(e) => handelFileUpload(e)}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <RiImageAddLine style={{ color: "#b9bbbe" }} />
            </IconButton>
          </label>

          <IconButton
            color="primary"
            component="button"
            onClick={() => setEmojiBtn(!emojiBtn)}
          >
            <GrEmoji style={{ color: "#b9bbbe" }} />
          </IconButton>
          {emojiBtn ? <Picker onSelect={addEmoji} theme="dark" /> : null}

          <form
            autoComplete="off"
            style={{ width: "100%", display: "flex" }}
            onSubmit={(e) => sendMsg(e)}
          >
            <TextField
              className={classes.message}
              required
              id="outlined-basic"
              label="Enter Message"
              variant="outlined"
              multiline
              rows={1}
              rowsMax={2}
              value={userNewMsg}
              onChange={(e) => {
                console.log(userNewMsg);
                setUserNewMsg(e.target.value);
              }}
            />

            <IconButton type="submit" component="button">
              <FiSend style={{ color: "#b9bbbe" }} />
            </IconButton>
          </form>
        </Grid>
      </div>
    </div>
  );
}

export default UserMessages;
