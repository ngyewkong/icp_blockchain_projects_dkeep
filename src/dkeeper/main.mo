import List "mo:base/List";
import Debug "mo:base/Debug";

actor DKeeper {
  // create new data type to hold the note
  // keep it public as the frontend react components will need to access it
  public type Note = {
    title: Text;
    content: Text;
  };

  // similar to javascript array
  // stable ensures persistence
  stable var notes: List.List<Note> = List.nil<Note>();

  public func createNote(titleText: Text, contentText: Text) {

    let newNote: Note = {
      title = titleText;
      content = contentText;
    };

    // add the new notes to the list of notes
    // use the push method of the List object
    // this is a pre-pending op not append
    // push the newNote into the beginning of the notes list
    // assign back to notes
    notes := List.push(newNote, notes);
    Debug.print(debug_show(notes));

  };

  // create a query function so that the frontend can get the stored data even after refresh
  // take in no inputs but return async Note array
  // array is easier to work with JS later on
  // we use list to store as it is serialised -> more efficient on the blockchain for create/delete later on
  public query func readNotes(): async [Note] {
      return List.toArray(notes);
  };

  // handle delete list item by index
  // List.drop remove the first n elements
  // List.take keep the first n elements
  // List.append to add the two sides
  // return the undeleted notes
  public func removeNote(id: Nat) {
    let listFront = List.take(notes, id);
    let listBack = List.drop(notes, id + 1);
    notes := List.append(listFront, listBack);
  };

}
