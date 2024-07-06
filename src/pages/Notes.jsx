/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api.service";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Note from "@/components/Note";

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get(`/notes/${loggedInUser.userId}`);
        setNotes(response.data.notes);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("User has no notes or user not found.");
          } else {
            setError("Server error while fetching notes.");
          }
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      fetchNotes();
    }
  }, [loggedInUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[60vh]">
  //       <p className="text-lg">{error}</p>
  //       <Button onClick={() => navigate("/notes/create")} className="mt-4">Add a Note</Button>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Notes</h1>
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg">You don't have any notes yet.</p>
          <Button onClick={() => navigate("/notes/create")} className="mt-4">Add a Note</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes?.map((note) => (
            <Note key={note._id} note={note}/>
          ))}
          <Button onClick={() => navigate("/notes/create")} className="mt-4">Add a Note</Button>
        </div>
      )}
    </div>
  );
}

export default NotesPage;