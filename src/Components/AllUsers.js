import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";
import { db } from "../Firebase/Firebase";
import { useHistory } from "react-router-dom";
import { IoMdContacts } from "react-icons/io";
import { FiCircle } from "react-icons/fi";
import AddUser from "./AddUser";
import Fade from "@material-ui/core/Fade";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  iconDesign: {
    fontSize: "1.5em",
    color: "#cb43fc",
  },
  primary: {
    color: "#cb43fc",
  },
}));

function AllUsers() {
  const classes = useStyles();
  const [userList, setUserList] = useState([]);
  const [useropen, setuserOpen] = React.useState(true);
  // const [open, setOpen] = React.useState(true);
  const [showAddUser, setshowAddUser] = useState(false);
  const history = useHistory();
  const [alert, setAlert] = useState(false);
  let currentUser;
  try {
    currentUser = JSON.parse(localStorage.getItem("userDetails"));
  } catch {
    if (currentUser === undefined) {
      currentUser = "";
    }
  }
  useEffect(() => {
    db.collection("users")
      // .where("isTyping", "==", "true")
      .onSnapshot((snapshot) => {
        console.log(snapshot);
        setUserList(
          snapshot.docs.map((user) => ({
            userName: user.data().displayName,
            id: user.id,
            email: user.data().email,
            isTyping: user.data().isTyping,
          }))
        );
      });
  }, []);

  // const handleClick = () => {
  //   setOpen(!open);
  // };

  const handleuserClick = () => {
    setuserOpen(!useropen);
  };
  const goToUser = (id, name, email) => {
    history.push(`/usermessage/${id}`);

    // console.log(id);
    history.push(`?name=${name}&email=${email}`);
  };

  const manageAddUserModal = () => {
    setshowAddUser(!showAddUser);
  };

  const handleAlert = () => {
    setAlert(!alert);
  };

  const addUser = (cName) => {
    if (cName) {
      cName = cName.toLowerCase().trim();
      if (cName === "") {
        handleAlert();
        return;
      }
    }
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={handleAlert}
        TransitionComponent={Fade}
        message="Room Name Already Exits!!"
        key={Fade}
        action={
          <IconButton aria-label="close" color="inherit" onClick={handleAlert}>
            <CloseIcon />
          </IconButton>
        }
      />

      {showAddUser ? (
        <AddUser create={addUser} manage={manageAddUserModal} />
      ) : null}
      <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
        <ListItemText primary="Add  Friends" />
        <IconButton edge="end" aria-label="add" onClick={manageAddUserModal}>
          <AddIcon className={classes.primary} />
        </IconButton>
      </ListItem>
      <Divider />

      <List component="nav" aria-labelledby="nested-list-subheader">
        <ListItem button onClick={handleuserClick}>
          <ListItemIcon>
            <IoMdContacts className={classes.iconDesign} />
          </ListItemIcon>
          <ListItemText primary="Your Friends" style={{ color: "#8e9297" }} />
          {useropen ? (
            <ExpandLess className={classes.primary} />
          ) : (
            <ExpandMore className={classes.primary} />
          )}
        </ListItem>
        <Collapse in={useropen} timeout="auto">
          <List component="div" disablePadding>
            {userList
              .filter((user) => user.email !== currentUser.email) // Fixed the condition to compare user ids
              .map((user) => (
                <ListItem
                  key={user.id}
                  button
                  className={classes.nested}
                  onClick={() => goToUser(user.id, user.userName, user.email)}
                >
                  {}
                  <ListItemText
                    primary={user.userName}
                    style={{ color: "#dcddde" }}
                  />
                  {user.isTyping && (
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <FiCircle
                        className={classes.iconDesign}
                        style={{ color: "green" }}
                      />
                    </ListItemIcon>
                  )}
                </ListItem>
              ))}
          </List>
        </Collapse>
      </List>
    </div>
  );
}
export default AllUsers;
