/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api.service";

function AddNoteForm() {
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(1);
  const [newProductCategory, setnewProductCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigateBack = useNavigate();
  const { loggedInUser } = useContext(AuthContext);

  function goBack() {
    navigateBack(-1);
  }

  async function createNewProduct(ev) {
    ev.preventDefault();
    if (
      newProductName.trim() === "" ||
      newProductPrice.trim() === "" ||
      newProductCategory.trim() === "" ||
      newProductQuantity < 1
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    if (loggedInUser === null) {
      alert("You must be logged in to add notes.");
      return;
    }

    try {
      const newProduct = {
        name: newProductName,
        price: newProductPrice,
        quantity: newProductQuantity,
        categories: newProductCategory.split(", "),
        user: loggedInUser.userId,
      };
      setLoading(true);
      await api.post("products/create", newProduct);
      setNewProductName("");
      setNewProductPrice("");
      setNewProductQuantity(1);
      setnewProductCategory("");
      goBack();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loggedInUser === null) {
    return <p>You must be logged in to add notes.</p>;
  }

  return (
    <div className="flex justify-center items-center w-full mt-8">
      <form
        onSubmit={createNewProduct}
        className="flex flex-col justify-center items-center gap-4 w-full"
      >
        <h6 className="text-xl font-semibold">Add New Product</h6>
        <input
          type="text"
          placeholder="Add product name..."
          value={newProductName}
          onChange={(ev) => setNewProductName(ev.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <input
          type="number"
          placeholder="Add price..."
          value={newProductPrice}
          onChange={(ev) => setNewProductPrice(ev.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <input
          type="number"
          placeholder="Add quantity..."
          value={newProductQuantity}
          onChange={(ev) => setNewProductQuantity(ev.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <input
          type="text"
          placeholder="Add category..."
          value={newProductCategory}
          onChange={(ev) => setnewProductCategory(ev.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white rounded-md px-4 py-2 flex items-center justify-center gap-2 focus:outline-none"
          disabled={loading}
        >
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
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-10a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3v-3z"
                clipRule="evenodd"
              />
            </svg>
          )}
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddNoteForm;
