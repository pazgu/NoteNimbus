/* eslint-disable react/prop-types */

function Note({ note }) {
  return (
    <div
      key={note._id}
      className="p-4 rounded shadow-md bg-white dark:bg-gray-800 dark:border dark:border-gray-700 h-full"
    >
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {note.title}
      </h2>
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
              <label className="text-gray-700 dark:text-gray-300">
                {todo.title}
              </label>
            </li>
          ))}
        </ul>
      )}
      {note.imageUrl && (
        <div className="mt-4">
          <img
            src={note.imageUrl}
            alt="Note"
            className="w-full h-auto max-h-64 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

export default Note;
