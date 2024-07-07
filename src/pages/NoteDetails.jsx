/* eslint-disable react/prop-types */

import {useParams } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/services/api.service";
import Note from "@/components/Note";

function NoteDetails(){
  const { id } = useParams(); 
  const { loggedInUser } = useContext(AuthContext); 
  const [note, setNote] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 


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


  if (loading) {
    return <div className="loader"></div>; 
  }

  if (error) {
    return <p>Error: {error.message}</p>; 
  }

  if (!note) {
    return <p>no such note</p>
  }

  return (
    <>
    <Note note={note}/>
    <Dialog>
        <DialogTrigger asChild>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Open Details</button>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>{note.title}</DialogTitle>
            <DialogDescription>{note.description}</DialogDescription>
        </DialogHeader>
        <div>
            <p>{note.body}</p>
            {note.todoList && note.todoList.length > 0 && (
            <ul className="mt-2">
                {note.todoList.map((todo, index) => (
                <li key={index} className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={todo.isComplete}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    readOnly
                    />
                    <label className="text-gray-700 dark:text-gray-300">{todo.title}</label>
                </li>
                ))}
            </ul>
            )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Close</button>
            </DialogClose>
        </DialogFooter>
        </DialogContent>
        </Dialog>
    </>
  );
}

export default NoteDetails;
