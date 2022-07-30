import ItemList from "./components/ItemList";
import ListTitle from "./components/ListTitle";
import ListEdit from "./components/ListEdit";
import CreateList from "./components/CreateList";
import LoadingSpin from "react-loading-spin";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Axios from "axios";
import NameInputModal from "./components/NameInputModal";
import LoadingBar from "react-top-loading-bar";
import RegisterOrLogin from "./components/RegisterOrLogin";

function App() {
  const [listName, setListName] = useState();
  const [listID, setListID] = useState();
  const [listItems, setListItems] = useState();
  const [listList, setListList] = useState();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [addOrEdit, setAddOrEdit] = useState();
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [userLoggedin, setLogin] = useState(false);
  const [username,setUsername]=useState("");

  const ref = useRef(null);
  

  Axios.defaults.baseURL = "https://sleepy-ridge-02151.herokuapp.com";
  // Axios.defaults.baseURL = "http://localhost:3001";
  Axios.defaults.withCredentials = true;

  useEffect(()=>{
    Axios.get("/checkLoginStatus",{ withCredentials: true }).then((res)=>{
      setLogin(res.data.status);
      if(res.data.status){
        setUsername(res.data.username);
      }
      Axios.get("/getListList").then((res) => {
        setListList(res.data.lists);
      });
      Axios.get("/getFirstList").then((res) => {
        changeList(res.data.id);
      });
    })
  },[]);

  function checkLoginStatus(){
    Axios.get("/checkLoginStatus",{ withCredentials: true }).then((res)=>{
      setLogin(res.data.status);
      if(res.data.status){
        setUsername(res.data.username);
      }
    });
    Axios.get("/getListList").then((res) => {
      setListList(res.data.lists);
    });
    Axios.get("/getFirstList").then((res) => {
      changeList(res.data.id);
    });
  }

  function deleteItem(itemIndex) {
    listItems.splice(itemIndex, 1);
    setListItems([...listItems]);

    const url = "/deleteItem/".concat(listID);
    Axios.patch(url, { index: itemIndex }).then((res) => {
      console.log(res);
    });
  }

  function addItem(item) {
    setListItems([...listItems, item]);
    const url = "/addItem/".concat(listID);
    Axios.patch(url, { item: item }).then((res) => {
      console.log(res);
    });
  }

  function changeList(id) {
    return new Promise((resolve, rej) => {
      const url = "/getList/".concat(id);
      Axios.get(url).then((res) => {
        setListName(res.data.name);
        setListItems(res.data.items);
        setListID(res.data._id);
        resolve();
      });
    });
  }

  function changeListFromOptions(id) {
    ref.current.continuousStart();
    changeList(id).then(() => {
      ref.current.complete();
    });
  }

  function createList(listName) {
    ref.current.continuousStart();
    const url = "/createList";
    Axios.post(url, { listName: listName }).then((res) => {
      changeList(res.data.id);
      setListList([...listList, { _id: res.data.id, name: listName }]);
      ref.current.complete();
    });
  }

  function deleteList() {
    ref.current.continuousStart();
    console.log("delete list triggered");
    const url = "/deleteList/".concat(listID);
    Axios.delete(url, { listID: listID }).then((res) => {
      console.log("delete then triggered");
      Axios.get("/getFirstList").then((res) => {
        console.log("got first list");
        changeList(res.data.id);
        const newListList = listList.filter((list) => list._id !== listID);
        setListList([...newListList]);
        ref.current.complete();
      });
    });
  }

  function editListName(newName) {
    ref.current.continuousStart();
    console.log("edit list name triggered");
    const url = "/updateListName/".concat(listID);
    Axios.patch(url, { newListName: newName }).then((res) => {
      setListName(newName);
      listList.forEach((list) => {
        if (list._id == listID) list.name = newName;
      });
      setListList(listList);
      ref.current.complete();
    });
  }

  function handleOKButtonClick(newListName) {
    setModalOpen(false);
    if (addOrEdit === "a") createList(newListName);
    else editListName(newListName);
  }

  function handleAddIconClick() {
    setAddOrEdit("a");
    handleOpen();
  }

  function handleEditIconClick() {
    setAddOrEdit("e");
    handleOpen();
  }

  function logout(){
    Axios.get("/logout").then((res)=>{
      checkLoginStatus();
    })
  }

  return userLoggedin!==undefined? (
    userLoggedin === true ? (
      listList ? (
        listList.length !== 0 ? (
          <div className="topContainer">
            <LoadingBar color="#f11946" ref={ref} />
            <div>
              {listName && <ListTitle listName={listName} />}
              {listItems && (
                <ItemList
                  listItems={listItems}
                  deleteItem={deleteItem}
                  addItem={addItem}
                />
              )}
            </div>
            {listName && listItems && listID && listList && (
              <ListEdit
                selectedName={listName}
                selectedID={listID}
                listList={listList}
                listChange={changeListFromOptions}
                handleAddIcon={handleAddIconClick}
                handleDeleteIcon={deleteList}
                handleEditIcon={handleEditIconClick}
                logout={logout}
                username={username}
              />
            )}
            <NameInputModal
              open={modalOpen}
              handleOpen={handleOpen}
              handleClose={handleClose}
              handleOKButtonClick={handleOKButtonClick}
            />
          </div>
        ) : (
          <div className="topContainer" style={{ alignItems: "center" }}>
            <LoadingBar color="#f11946" ref={ref} />
            <CreateList username={username} createList={createList} logout={logout}/>
          </div>
        )
      ) : (
        <div className="topContainer" style={{ alignItems: "center" }}>
          <div style={{ marginTop: "125px" }}>
            <LoadingSpin size="30px" />
          </div>
        </div>
      )
    ) : (
      <div className="topContainer" style={{ alignItems: "center" }}>
        <RegisterOrLogin checkStatus={checkLoginStatus}/>
      </div>
    )
  ) : (
    <div className="topContainer" style={{ alignItems: "center" }}>
      <div style={{ marginTop: "125px" }}>
        <LoadingSpin size="30px" />
      </div>
    </div>
  );
}

export default App;
