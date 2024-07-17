/* eslint-disable react/prop-types */

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/services/api.service";
import Note from "@/components/Note";
import { AuthContext } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

function NoteDetails() {
  const { id } = useParams();
  const { loggedInUser } = useContext(AuthContext);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState(null);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [deletingImage, setDeletingImage] = useState(false);
  const [isOpen, setIsOpen] = useState(false); //to alert confirm
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

  function handleEdit() {
    setEditMode(true);
    setEditedNote({ ...note });
    setCollaborators(note.collaborators || []);
  }

  function handleCancelEdit() {
    setEditMode(false);
    setEditedNote(null);
  }

  async function handleSaveChanges() {
    try {
      await api.put(`notes/${loggedInUser.userId}/${id}`, editedNote);
      setNote(editedNote);
      setEditMode(false);
      toast({
        title: "Note edited",
        description: "Your note has been successfully edited.",
        status: "success",
      });
    } catch (error) {
      setError(error);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === "newTodo") {
      setNewTodo(value);
    } else if (type === "checkbox") {
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
  }

  function handleAddTodo() {
    if (newTodo.trim() === "") return;
    const newTodoItem = { title: newTodo, isComplete: false };
    const updatedTodoList = [...editedNote.todoList, newTodoItem];
    setEditedNote({ ...editedNote, todoList: updatedTodoList });
    setNewTodo("");
  }

  function handleDelete() {
    try {
      setIsOpen(true);
    } catch (error) {
      setError(error);
    }
  }

  async function handleConfirmDelete() {
    try {
      setIsOpen(false);
      await api.delete(`notes/${loggedInUser.userId}/${id}`);
      navigate(-1);
    } catch (error) {
      setError(error);
      setIsOpen(false);
    }
  }

  function handleCancelDelete() {
    setIsOpen(false);
  }

  async function handleDeleteImage() {
    const updatedNote = { ...editedNote, imageUrl: null };
    setEditedNote(updatedNote);
    try {
      setDeletingImage(true);
      await api.delete(`/notes/${note._id}/image`);
      setNote(updatedNote);
    } catch (error) {
      console.error("Error deleting image:", error);
      setEditedNote({ ...editedNote, imageUrl: note.imageUrl });
    } finally {
      setDeletingImage(false);
    }
  }

  async function handleInviteCollaborator() {
    try {
      const response = await api.post(
        `/notes/${loggedInUser.userId}/${note._id}/invite`,
        {
          email: collaboratorEmail,
        }
      );
      setNote((prevNote) => ({
        ...prevNote,
        collaborators: response.data.collaborators,
      }));
      setCollaborators([...collaborators, collaboratorEmail]);
      setCollaboratorEmail("");
      toast({
        title: "Collaborator Invited",
        description: `${collaboratorEmail} has been invited to collaborate.`,
        status: "success",
      });
    } catch (error) {
      console.error("Error inviting collaborator:", error);
      if (error.response && error.response.status === 403) {
        setError("You don't have permission to view this note.");
        console.log(error);
      }
      if (error.response.status === 404) {
        toast({
          title: "Error",
          description:
            "User not found. Please check the email address and try again.",
          status: "error",
        });
        return;
      }
      if (error.response.status === 400) {
        toast({
          title: "Error",
          description:
            "Collaborator already invited and this note is shared with.",
          status: "error",
        });
        return;
      }
      toast({
        title: "Error",
        description: "There was an error inviting the collaborator.",
        status: "error",
      });
    }
  }

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
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription id="alert-dialog-description">
              This action cannot be undone. This will permanently delete your
              note and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel as="button" onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              as="button"
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleConfirmDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex justify-center items-center h-full">
        <div className="max-w-3xl w-full p-4">
          <Note note={note} />
        </div>
      </div>
      <Dialog className="h-auto max-h-screen">
        <div className="flex justify-center">
          <DialogTrigger asChild>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleEdit}
            >
              Edit Note
            </button>
          </DialogTrigger>
        </div>
        <DialogTitle></DialogTitle>
        <DialogContent className="overflow-y-auto max-h-[calc(100vh-10rem)] scrollbar-thin">
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
                    <label className="text-gray-700 dark:text-gray-300">
                      {todo.title}
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {editMode &&
              editedNote.todoList &&
              editedNote.todoList.length > 0 && (
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
                      <label className="text-gray-700 dark:text-gray-300">
                        {todo.title}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            {editMode && (
              <div className="mt-4 flex flex-row">
                <input
                  type="text"
                  name="newTodo"
                  value={newTodo}
                  onChange={handleChange}
                  placeholder="Enter new todo..."
                  className="px-4 py-2 w-full border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                  onClick={handleAddTodo}
                  className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
                >
                  +
                </button>
              </div>
            )}
            {note.imageUrl && (
              <div className="mt-4 relative">
                <img
                  src={note.imageUrl}
                  alt="Note"
                  className="w-full h-auto max-h-64 object-cover rounded-lg"
                />
                <button
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                  disabled={deletingImage}
                >
                  {deletingImage ? "Deleting..." : "Delete Image"}
                </button>
              </div>
            )}
          </div>
          {editMode && (
            <div className="mt-4">
              <label
                htmlFor="collaboratorEmail"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Invite Collaborator
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="email"
                  name="collaboratorEmail"
                  id="collaboratorEmail"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  className="px-4 py-2 w-full border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter email"
                />
                <button
                  type="button"
                  onClick={handleInviteCollaborator}
                  className="ml-2 px-4 py-2 bg-green-600 text-white rounded-r-md"
                >
                  Invite
                </button>
              </div>
            </div>
          )}
          {editMode && collaborators.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Collaborators
              </h3>
              <ul className="mt-2">
                {collaborators.map((email, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-200">
                      {email}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <DialogFooter>
            {editMode ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="mt-4 px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete Note
                </button>
              </>
            ) : (
              <DialogClose asChild>
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
                  Close
                </button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}

export default NoteDetails;
