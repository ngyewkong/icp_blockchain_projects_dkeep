import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { dkeeper } from "../../../declarations/dkeeper";

function App() {
  const [notes, setNotes] = useState([]);

  // modify to take into motoko backend function createNote
  // reverse the return objects order to make it prepend on frontend
  function addNote(newNote) {
    setNotes((prevNotes) => {
      dkeeper.createNote(newNote.title, newNote.content);
      return [newNote, ...prevNotes];
    });
  }

  // useEffect gets called whenever app component is re-rendered
  // however useEffect cannot be turn into an async function
  // handled by fetchData
  // empty array for the second parameter make sure it only renders once
  useEffect(() => {
    console.log("useEffect is triggered");
    fetchData();
  }, []);

  async function fetchData() {
    // readNotes return an array
    const notesArray = await dkeeper.readNotes();
    // set the notes update the state of the notes constant
    // app component gets re-rendered
    // infinite loop of re-rendering
    // resolve by the second parameter of the useEffect hook
    setNotes(notesArray);
  }

  function deleteNote(id) {
    dkeeper.removeNote(id);

    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
