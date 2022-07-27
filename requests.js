import { API_URL } from "./utilities.js";

export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete");
    }
    const data = await response.json();
  } catch (err) {}
};

export const getTodos = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(response.message);
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const postTodo = async (todo) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to post");
    }
    const data = await response.json();

    return data;
  } catch (err) {
    displayElement(posAbsoluteContainer, err.message);
  }
};
