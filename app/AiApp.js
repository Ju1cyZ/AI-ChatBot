import { loadChats, newChat } from './Utils/Fonction.js'
import { newAiMessage, fetchStreamingResponse, setChatIndex } from './Api/FonctionAPI.js'

const input = document.querySelector("#input")
const button = document.querySelector("#chat")
const windows = document.querySelector("#windows")

loadChats();

button.addEventListener("click", async () => {
    fetchStreamingResponse(input.value, windows)
})

document.body.addEventListener("click", (event) => {
    if (event.target.dataset.chatId === "newChat") {
        setChatIndex(newChat());
        loadChats();
    }
    else if (event.target.dataset.chatId !== undefined) {
        setChatIndex(event.target.dataset.chatId);
    }
})

