// Select elements
const searchField = document.querySelector("#wordInput");
const resultBox = document.querySelector("#result");

// Function to fetch word details
async function fetchWord() {
    let word = searchField.value.trim();

    
    // Check if the input field is empty
    if (word === "") {
        showError("Please enter a word!");
        return;
    }

    let endpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {

        // Fetch word data from API
        const response = await fetch(endpoint);


        // Check if the response is successful
        if (!response.ok) {
            throw new Error("Word not found!");
        }

        const data = await response.json();

        // Extract data safely
        let wordName = data[0]?.word || word;
        let phonetic = data[0]?.phonetic || "No phonetics available.";
        let audio = data[0]?.phonetics?.find(p => p.audio)?.audio || "";

        let meaning = data[0]?.meanings?.[0] || {};
        let partOfSpeech = meaning?.partOfSpeech || "N/A";
        let definition = meaning?.definitions?.[0]?.definition || "No definition available.";
        let example = meaning?.definitions?.[0]?.example || "No example available.";
        let synonyms = meaning?.synonyms?.join(", ") || "No synonyms available.";
        let antonyms = meaning?.antonyms?.join(", ") || "No antonyms available.";

        updateUI(wordName, phonetic, audio, partOfSpeech, definition, example, synonyms, antonyms);
    } catch (error) {
        console.error(error.message);
        showError(error.message);
    }
}

// Function to update UI
function updateUI(word, phonetic, audio, pos, definition, example, synonyms, antonyms) {
    resultBox.innerHTML = `
        <h2>${word} <span class="phonetic">(${phonetic})</span></h2>
        <p><strong>Part of Speech:</strong> ${pos}</p>
        <p><strong>Definition:</strong> ${definition}</p>
        <p><strong>Example:</strong> "${example}"</p>
        <p><strong>Synonyms:</strong> ${synonyms}</p>
        <p><strong>Antonyms:</strong> ${antonyms}</p>
        ${audio ? `<audio controls><source src="${audio}" type="audio/mpeg">Your browser does not support audio.</audio>` : ""}
    `;
    resultBox.style.display = "block";
}

// Function to show errors
function showError(message) {
    resultBox.innerHTML = `<p class="error">${message}</p>`;
    resultBox.style.display = "block";
}
