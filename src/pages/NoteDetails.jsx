/* eslint-disable react/prop-types */

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import api from "@/services/api.service";
import Note from "@/components/Note";
import { AuthContext } from "@/context/AuthContext";

function NoteDetails() {
  const { id } = useParams();
  const { loggedInUser } = useContext(AuthContext);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState(null);
  const [newTodo, setNewTodo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getNoteById() {
      setLoading(true);
      try {
        const response = await api.get(`notes/${loggedInUser.userId}/${id}`);
        const details = response.data;
        setNote(details);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    if (loggedInUser) {
      getNoteById();
    }
  }, [id, loggedInUser]);

  const handleEdit = () => {
    setEditMode(true);
    setEditedNote({ ...note });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedNote(null);
  };

  const handleSaveChanges = async () => {
    try {
      await api.put(`notes/${loggedInUser.userId}/${id}`, editedNote);
      setNote(editedNote);
      setEditMode(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updatedTodoList = editedNote.todoList.map((todo, index) => {
        if (index.toString() === name) {
          return { ...todo, isComplete: checked };
        }
        return todo;
      });
      setEditedNote({ ...editedNote, todoList: updatedTodoList });
    } else {
      setEditedNote({ ...editedNote, [name]: value });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    try {
      await api.delete(`notes/${loggedInUser.userId}/${id}`);
      navigate(-1);
    } catch (error) {
      setError(error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") return;
    try {
      const response = await api.post(`notes/${loggedInUser.userId}/${editedNote._id}/todos`, {
        title: newTodo,
        isComplete: false
      });
      const updatedTodoList = [...editedNote.todoList, response.data];
      setEditedNote({ ...editedNote, todoList: updatedTodoList });
      setNewTodo("");
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!note) {
    return <p>No such note</p>;
  }

  return (
    <>
       <div className="flex justify-center items-center h-full">
        <div className="max-w-3xl w-full p-4">
            <Note note={note} />
        </div>
      </div>
      <Dialog>
        <div className="flex justify-center">
            <DialogTrigger asChild>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleEdit}>
                {editMode ? 'Edit Note' : 'Open Details'}
                </button>
            </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            {editMode ? (
              <input
                type="text"
                name="title"
                value={editedNote.title}
                onChange={handleChange}
                className="mt-2 px-4 py-2 w-full border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300 rounded-md"
              />
            ) : (
              <>
                <DialogTitle>{note.title}</DialogTitle>
                <DialogDescription>{note.description}</DialogDescription>
              </>
            )}
          </DialogHeader>
          <div>
            {editMode ? (
                <input
                type="text"
                name="description"
                value={editedNote.description}
                onChange={handleChange}
                className="mt-2 px-4 py-2 w-full border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                />
            ) : (
                <p>{note.body}</p>
            )}
            {editMode ? (
                <textarea
                name="body"
                value={editedNote.body}
                onChange={handleChange}
                className="mt-2 px-4 py-2 w-full h-32 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                />
            ) : (
                <ul className="mt-2">
                {note.todoList.map((todo, index) => (
                    <li key={index} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name={index.toString()}
                        checked={todo.isComplete}
                        readOnly
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <label className="text-gray-700 dark:text-gray-300">{todo.title}</label>
                    </li>
                ))}
                </ul>
            )}
            {editMode && editedNote.todoList && editedNote.todoList.length > 0 && (
                <ul className="mt-2">
                {editedNote.todoList.map((todo, index) => (
                    <li key={index} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name={index.toString()}
                        checked={todo.isComplete}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <label className="text-gray-700 dark:text-gray-300">{todo.title}</label>
                    </li>
                ))}
                </ul>
            )}
            {editMode && (
                <div className="mt-4">
                <input
                    type="text"
                    name="newTodo"
                    value={newTodo}
                    onChange={handleChange}
                    placeholder="Enter new todo..."
                    className="px-4 py-2 w-full border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                />
                <button onClick={handleAddTodo} className="ml-2 px-4 py-2 bg-green-600 text-white rounded">
                    Add Todo
                </button>
                </div>
            )}
            </div>
          <DialogFooter>
            {editMode ? (
              <>
                <button onClick={handleSaveChanges} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
                  Save Changes
                </button>
                <button onClick={handleCancelEdit} className="mt-4 px-4 py-2 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button onClick={handleDelete} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
                  Delete Note
                </button>
              </>
            ) : (
                <DialogClose asChild>
                    <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Close</button>
                </DialogClose>
            )}

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NoteDetails;
