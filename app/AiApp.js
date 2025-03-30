import { newAiMessage, fetchStreamingResponse } from './Api/Fonction.mjs'


const input = document.querySelector("#input")
const button = document.querySelector("#chat")
const windows = document.querySelector("#windows")

button.addEventListener("click", async () => {
    // newAiMessage(input.value, windows);


    fetchStreamingResponse(input.value, windows)
})


