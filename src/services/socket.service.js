import io from "socket.io-client";

const socket = io("http://localhost:3000");

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
