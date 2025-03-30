import { API_URL } from "./Const.mjs";

const model = "llama3";
let windowCount = 0;
let History = [];

if (localStorage.getItem("History") !== null) {
    History = JSON.parse(localStorage.getItem("History"));
    loadWindows();
}


async function chatWithAi(input) {

    History.push({
        role: "user",
        content: input
    })

    const bodyData = {
        model: model,
        messages: History,
        stream: false
    }

    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        cache: 'no-cache',
    };

    const resp = await fetch(API_URL, options);
    const data = await resp.json();

    History.push({
        role: "assistant",
        content: data.message.content,
    })

    localStorage.setItem("History", JSON.stringify(History));
    return data;
}

export async function newAiMessage(input, windowsDiv) {
    windowsDiv.innerHTML += `<div class="chat chat-end">
            <div class="chat-bubble">${input}</div>
        </div>`
    windowCount++;
    let html = `
        <div id="${windowCount}" class="m-5 pt-5 mockup-window bg-base-100 border border-base-300">
            <div class="opacity-25 m-5 grid h-160 window">
                <textarea class="border-none output" readonly></textarea>
                <progress id="loadingResp" class="display-none progress w-56"></progress>
            </div>
            <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                <progress id="loadingResp" class="progress w-56"></progress>
                <span class="sr-only">Loading...</span>
            </div>
        </div>`;

    window.location = `#${windowCount}`

    windowsDiv.innerHTML += html;
    try {
        const resp = await chatWithAi(input)

        const lastWindow = windowsDiv.lastElementChild.querySelector(".window");
        const output = lastWindow.querySelector(".output");
        const loader = lastWindow.querySelector(".loading");

        output.textContent = markdownInterpreter(resp.message.content);

        //Loading Animations
        output.classList.remove("display-none");
        lastWindow.classList.remove("place-content-center")
        loader.classList.add("display-none")
    }
    catch (error) {
        showErrorMessage("Erreur! " + error);
    }

}

function showErrorMessage(text) {
    const ErrorMessage = document.querySelector("#ErrorMessage");
    const ErrorText = document.querySelector("#ErrorText")

    ErrorMessage.classList.remove("display-none");
    ErrorText.textContent = text;
}

export async function fetchStreamingResponse(input, windowsDiv) {

    windowsDiv.innerHTML += `<div class="chat chat-end">
            <div class="chat-bubble">${input}</div>
        </div>`
    windowCount++;
    let html = `
        <div id="${windowCount}" class="m-5 pt-5 mockup-window bg-base-100 border border-base-300">
            <div class="opacity-25 m-5 grid h-160 window">
                <textarea class="border-none output" readonly></textarea>
                <progress class="display-none progress w-56"></progress>
            </div>
            <div role="status" class="loader absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                <span class="loading loading-infinity loading-xl"></span>
                <span class="sr-only">Loading...</span>
            </div>
        </div>`;

    window.location = `#${windowCount}`

    windowsDiv.innerHTML += html;

    History.push({
        role: "user",
        content: input
    })

    const bodyData = {
        model: model,
        messages: History,
        stream: true
    }

    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        cache: 'no-cache',
    };

    try {
        const response = await fetch(API_URL, options); // Remplace par l'URL de ton API
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const lastWindow = windowsDiv.lastElementChild.querySelector(".window");
        const output = lastWindow.querySelector(".output");
        const loader = document.getElementById(windowCount).querySelector(".loader");

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // Transformer chaque chunk JSON en objet
            const messages = chunk.split("\n").filter(line => line).map(line => JSON.parse(line));
            messages.forEach(msg => {
                if (msg.message && msg.message.content) {
                    output.textContent += msg.message.content; // Construire le texte final
                }
            });
        }

        History.push({
            role: "assistant",
            content: output.textContent,
        })

        //Loading Animations
        lastWindow.classList.remove("place-content-center")
        lastWindow.classList.remove("opacity-25")
        console.log(loader)
        loader.classList.add("display-none")

        localStorage.setItem("History", JSON.stringify(History));
    }
    catch (error) {
        showErrorMessage("Erreur! " + error);
    }


}


function loadWindows() {
    const windowsDiv = document.querySelector("#windows")

    History.forEach((item) => {
        if (item.role === "assistant") {
            windowCount++;
            windowsDiv.innerHTML += `
                <div id="${windowCount}" class="m-5 pt-5 mockup-window bg-base-100 border border-base-300">
                    <div class="m-5 grid h-160 window">
                        <textarea class="border-none output" readonly>${item.content}</textarea>
                    </div>
                    <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                        <progress class="display-none progress w-56"></progress>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>`
        }
        else if (item.role === "user") {
            windowsDiv.innerHTML += `<div class="chat chat-end">
            <div class="chat-bubble">${item.content}</div>
        </div>`
        }
    })

    window.location = `#${windowCount}`
}