export const API_URL = "https://jsonplaceholder.typicode.com/todos";

const messageSuccess = document.querySelector(".message__main");

export const displayElement = function (element, message) {
  element.classList.remove("hidden");
  displayMessage(messageSuccess, message);
  setTimeout(() => {
    element.classList.add("hidden");
  }, 2000);
};
// display message after user input validation
export const displayMessage = function (element, msg) {
  element.textContent = msg;
  setTimeout(() => {
    element.textContent = "";
  }, 2000);
};
// total elements
export const displayTotal = function (element, length) {
  element.textContent = length;
};

export const clearInput = function (...inputs) {
  inputs.forEach((input) => (input.value = ""));
};
