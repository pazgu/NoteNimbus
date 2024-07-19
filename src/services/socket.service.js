/* eslint-disable no-undef */
import io from "socket.io-client";

let socket;

if (process.env.NODE_ENV === "production") {
  // In production, connect to the same host
  socket = io();
} else {
  // In development
  socket = io("http://localhost:3000");
}

export const joinNote = (noteId) => {
  socket.emit("join_note", noteId);
};

export const leaveNote = (noteId) => {
  socket.emit("leave_note", noteId);
};

export const onNoteUpdated = (callback) => {
  socket.on("note_updated", callback);
};

export const offNoteUpdated = () => {
  socket.off("note_updated");
};

export default socket;
