/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api.service";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Note from "@/components/Note";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayTable, setDisplayTable] = useState(false);
  const { loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  

  useEffect(() => {
    async function fetchNotes () {
      try {
        const response = await api.get(`/notes/${loggedInUser.userId}`);
        setNotes(response.data.notes);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            console.error("User has no notes or user not found.");
          } else {
            console.error("Server error while fetching notes.");
          }
        } else {
          console.error("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (loggedInUser) {
      fetchNotes();
    }
  }, [loggedInUser]);

  function toggleDisplay() {
    setDisplayTable(prev => !prev);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
      <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">My Notes</h1>
      <div className="mb-4 flex justify-center">
        <Button onClick={toggleDisplay} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none">
          {displayTable ? 'Show as Cards' : 'Show as Table'}
        </Button>
      </div>
      <div className="mb-4 flex justify-start">
        <Button onClick={() => navigate('/notes/create')} className="bg-blue-500 hover:bg-blue-700 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none">
          Add a Note
        </Button>
      </div>
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg">You don't have any notes yet.</p>
          <Button onClick={() => navigate('/notes/create')} className="mt-4">
            Add a Note
          </Button>
        </div>
      ) : (
        <div>
          {displayTable ? (
             <Table>
             <TableHeader>
               <TableRow>
                 <TableCell>Title</TableCell>
                 <TableCell>Description</TableCell>
                 <TableCell>Selected Todos</TableCell>
               </TableRow>
             </TableHeader>
             <TableBody>
               {notes.map(note => (
                 <TableRow key={note._id}>
                   <TableCell>{note.title}</TableCell>
                   <TableCell>{note.description}</TableCell>
                   <TableCell>
                      <input
                        type="checkbox"
                        checked={note.todoList.some(todo => todo.isComplete)}
                        readOnly
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2">
                        {note.todoList.filter(todo => todo.isComplete).length}
                      </span>
                    </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map(note => (
                <Note key={note._id} note={note} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotesPage;