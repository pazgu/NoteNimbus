/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function AddNoteForm() {
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteDescription, setNewNoteDescription] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");
  const [newTodoList, setNewTodoList] = useState([{ title: "", isComplete: false }]);
  const [loading, setLoading] = useState(false);
  const navigateBack = useNavigate();
  const { loggedInUser } = useContext(AuthContext);

  function goBack() {
    navigateBack(-1);
  }

  function handleTodoChange(index, field, value) {
    const updatedTodoList = newTodoList.map((todo, i) => 
      i === index ? { ...todo, [field]: value } : todo
    );
    setNewTodoList(updatedTodoList);
  }

  function addTodo() {
    setNewTodoList([...newTodoList, { title: "", isComplete: false }]);
  }

  async function createNewNote(ev) {
    ev.preventDefault();
    if (
      newNoteTitle.trim() === "" ||
      newNoteDescription.trim() === "" ||
      newNoteBody.trim() === "" ||
      newTodoList.some(todo => todo.title.trim() === "")
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    if (loggedInUser === null) {
      alert("You must be logged in to add notes.");
      return;
    }

    try {
      const newNote = {
        title: newNoteTitle,
        description: newNoteDescription,
        body: newNoteBody,
        todoList: newTodoList,
        isPinned: false,
        user: loggedInUser.userId,
      };
      setLoading(true);
      await api.post("notes/create", newNote);
      setNewNoteTitle("");
      setNewNoteDescription("");
      setNewNoteBody("");
      setNewTodoList([{ title: "", isComplete: false }]);
      goBack();
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loggedInUser === null) {
    return <p>You must be logged in to add notes.</p>;
  }

  return (
    <div className="flex justify-center items-center w-full mt-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createNewNote} className="space-y-4">
            <div>
              <Label htmlFor="title">Note Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Add title..."
                value={newNoteTitle}
                onChange={(ev) => setNewNoteTitle(ev.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Add description..."
                value={newNoteDescription}
                onChange={(ev) => setNewNoteDescription(ev.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Input
                id="body"
                type="text"
                placeholder="Add body..."
                value={newNoteBody}
                onChange={(ev) => setNewNoteBody(ev.target.value)}
                required
              />
            </div>
            <div>
              <Label>Todo List</Label>
              {newTodoList.map((todo, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Todo title..."
                    value={todo.title}
                    onChange={(ev) => handleTodoChange(index, "title", ev.target.value)}
                    required
                  />
                  <Input
                    type="checkbox"
                    checked={todo.isComplete}
                    onChange={(ev) => handleTodoChange(index, "isComplete", ev.target.checked)}
                  />
                </div>
              ))}
              <Button type="button" onClick={addTodo} className="mt-2">
                Add Todo
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V2.5"
                  ></path>
                </svg>
              ) : (
                "Add Note"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={goBack} className="bg-gray-500 hover:bg-gray-700 text-white">
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AddNoteForm;
