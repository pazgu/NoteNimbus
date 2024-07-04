import { Button } from "@/components/ui/button";
import api from "@/services/api.service";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "/home";

function HomePage() {
  const [dummyNotes, setDummyNotes] = useState([]);
  const navigate = useNavigate();

  async function generateDummyNotes() {
    try {
      const response = await api.get(BASE_URL); 
      setDummyNotes(response.data);
    } catch (error) {
      console.error("Error fetching dummy notes:", error);
    }
  }

  useEffect(() => {
    generateDummyNotes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-12 text-center bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Welcome to My NoteNimbus App</h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">An intuitive app to manage your notes and tasks efficiently.</p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Easily create, update, and organize your tasks with a clean and simple interface.</p>
      </header>
      <div className="mb-6 mt-6 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">Join our community of organized and efficient users. Sign up or log in to get started!</p>
        <Button className="mr-4 text-lg py-3 px-6" onClick={() => navigate('/auth/login')}>Login</Button>
        <Button className="text-lg py-3 px-6" onClick={() => navigate('/auth/register')}>Register</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dummyNotes.map((note) => (
          <div key={note._id} className="p-4 rounded shadow-md bg-white dark:bg-gray-800 dark:border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{note.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">{note.description}</p>
            <p className="text-gray-700 dark:text-gray-300">{note.body}</p>
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
        ))}
      </div>
    </div>
  );
}


export default HomePage;