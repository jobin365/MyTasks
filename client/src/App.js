import ItemList from "./components/ItemList";
import ListTitle from "./components/ListTitle";
import ListEdit from "./components/ListEdit";
import CreateList from "./components/CreateList";
import LoadingSpin from "react-loading-spin";
import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
import NameInputModal from "./components/NameInputModal"


function App() {
  const [listName, setListName] = useState();
  const [listID, setListID] = useState();
  const [listItems, setListItems] = useState();
  const [listList, setListList] = useState();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [addOrEdit,setAddOrEdit]=useState();
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  

  // Axios.defaults.baseURL = "https://sleepy-ridge-02151.herokuapp.com";
  Axios.defaults.baseURL = "http://localhost:3000";

  useEffect(() => {
    console.log('first effect triggered')
    Axios.get("/getListList").then((res) => {
      setListList(res.data.lists);
    });
  }, []);

  useEffect(() => {
    console.log('second effect triggered')
    Axios.get("/getFirstList").then((res) => {
      changeList(res.data.id);
    });
  }, []);

  function changeListName(newName) {
    setListName(newName);
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
    console.log('who does not like a change');
    const url = "/getList/".concat(id);
    Axios.get(url).then((res) => {
      setListName(res.data.name);
      setListItems(res.data.items);
      setListID(res.data._id);
    });
  }

  function createList(listName) {
    const url = "/createList";
    Axios.post(url, { listName: listName }).then((res) => {
      changeList(res.data.id);
      setListList([...listList,{id:res.data.id,name:listName}]);
    });
  }

  function deleteList(){
    console.log('delete list triggered');
    const url="/deleteList/".concat(listID);
    Axios.delete(url,{listID:listID}).then((res)=>{
      Axios.get("/getFirstList").then((res) => {
        changeList(res.data.id);
        const newListList=listList.filter(list=>
          list.id!==listID
        )
        setListList([...newListList])
      });
    });
  }

  function editListName(newName){
    console.log('edit list name triggered');
    const url="/updateListName/".concat(listID);
    Axios.patch(url,{newListName:newName}).then((res)=>{
      setListName(newName);
      listList.forEach(list => {
        if(list.id===listID)
          list.name=newName;
      });
      setListList(listList);
    })
  }

  function handleOKButtonClick(newListName){
    setModalOpen(false);
    if(addOrEdit==="a")
      createList(newListName);
    else
      editListName(newListName);
  }

  function handleAddIconClick(){
    setAddOrEdit('a');
    handleOpen();
  }

  function handleEditIconClick(){
    setAddOrEdit('e');
    handleOpen();
  }

  return listList ? (
    listList.length !== 0 ? (
      <div className="topContainer">
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
            listChange={changeList}
            handleAddIcon={handleAddIconClick}
            handleDeleteIcon={deleteList}
            handleEditIcon={handleEditIconClick}
          />
        )}
        <NameInputModal open={modalOpen} handleOpen={handleOpen} handleClose={handleClose} handleOKButtonClick={handleOKButtonClick}/>
      </div>
    ) : (
      <div className="topContainer" style={{ alignItems: "center" }}>
        <CreateList createList={createList} />
      </div>
    )
  ) : (
    <div className="topContainer" style={{ alignItems: "center" }}>
      <div style={{ marginTop : "125px" }}>
        <LoadingSpin size="30px" />
      </div>
    </div>
  );
}

export default App;
