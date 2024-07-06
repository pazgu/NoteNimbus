import Note from "@/components/Note";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const {loggedInUser} = useContext(AuthContext);
  const dummyNotes = [
    {
      title: "Grocery Shopping",
      description: "Buy groceries for the week.",
      body: "Make sure to buy all the essentials and check for discounts.",
      todoList: [
        { title: "Buy milk", isComplete: true },
        { title: "Buy eggs", isComplete: false },
        { title: "Buy bread", isComplete: true },
        { title: "Buy vegetables", isComplete: false },
      ],
      isPinned: false,
    },
    {
      title: "Team Meeting",
      description: "Discuss project progress and next steps.",
      body: "Prepare slides and notes for the meeting.",
      todoList: [
        { title: "Prepare slides", isComplete: true },
        { title: "Review project milestones", isComplete: true },
        { title: "Outline next steps", isComplete: false },
        { title: "Send meeting invite", isComplete: true },
      ],
      isPinned: true,
    },
    {
      title: "Doctor's Appointment",
      description: "Routine check-up with Dr. Smith.",
      body: "Bring medical records and list of medications.",
      todoList: [
        { title: "Bring insurance card", isComplete: false },
        { title: "Prepare questions for doctor", isComplete: true },
        { title: "Confirm appointment time", isComplete: true },
        { title: "Bring previous test results", isComplete: false },
      ],
      isPinned: false,
    },
    {
      title: "Finish Reading Book",
      description: "Complete the last chapter of 'Atomic Habits'.",
      body: "Summarize key takeaways and apply to daily routine.",
      todoList: [
        { title: "Read chapter 10", isComplete: false },
        { title: "Summarize key points", isComplete: false },
        { title: "Apply concepts to daily routine", isComplete: false },
      ],
      isPinned: true,
    },
    {
      title: "Update Resume",
      description: "Add recent job experience and skills.",
      body: "Highlight key achievements and update contact information.",
      todoList: [
        { title: "Add new job position", isComplete: true },
        { title: "Update skills section", isComplete: false },
        { title: "Review for typos", isComplete: false },
        { title: "Export to PDF", isComplete: false },
      ],
      isPinned: false,
    },
    {
      title: "Plan Weekend Trip",
      description: "Organize a weekend trip to the mountains.",
      body: "Book accommodation and plan activities.",
      todoList: [
        { title: "Book cabin", isComplete: true },
        { title: "Pack hiking gear", isComplete: false },
        { title: "Plan itinerary", isComplete: true },
        { title: "Check weather forecast", isComplete: false },
      ],
      isPinned: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <header className="w-full py-12 text-center bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Welcome to My NoteNimbus App</h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">An intuitive app to manage your notes and tasks efficiently.</p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Easily create, update, and organize your tasks with a clean and simple interface.</p>
      </header>
      {loggedInUser === null && 
      <div className="mb-6 mt-6 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">Join our community of organized and efficient users. Sign up or log in to get started!</p>
        <Button className="mr-4 text-lg py-3 px-6" onClick={() => navigate('/auth/login')}>Login</Button>
        <Button className="text-lg py-3 px-6" onClick={() => navigate('/auth/register')}>Register</Button>
      </div> }
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-3">
        {dummyNotes.map((note) => (
         <Note key={note.title} note={note}/>
        ))}
      </div>
    </div>
  )
}


export default HomePage;