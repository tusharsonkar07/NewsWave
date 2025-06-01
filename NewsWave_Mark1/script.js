document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "5416735694a640c181d7ad626ae96005"; // Replace with your News API key
    const apiUrl = "https://newsapi.org/v2/top-headlines";
    const defaultCategory = "general"; // Default category to load

    const newsContent = document.getElementById("news-content");

    // Function to fetch news based on category
async function fetchNews(category) {
    const response = await fetch(`${apiUrl}?category=${category}&language=en&apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles;
}


    // Function to display news in the content view
function displayNews(articles) {
    newsContent.innerHTML = ""; // Clear previous content
    articles.forEach(article => {
        const articleElement = document.createElement("article");
        articleElement.innerHTML = `
            <div class="article-thumbnail">
                <img src="${article.urlToImage}" alt="${article.title}">
            </div>
            <div class="article-details">
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        `;
        newsContent.appendChild(articleElement);
    });
}


    // Initial load
    fetchNews(defaultCategory)
        .then(articles => displayNews(articles))
        .catch(error => console.error("Error fetching news:", error));

    // Event listener for category links
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("id").replace("category-", "");
            fetchNews(category)
                .then(articles => displayNews(articles))
                .catch(error => console.error("Error fetching news:", error));
        });
    });
});

//Chatbot ahead

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "AIzaSyAeOyDTyFgvFFY_6QTScv4-n75mNyi-4Bs"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const API_URL = "https://generativeai.googleapis.com/v1/models/gemini-1.5-flash:generateText";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gemini-1.5-flash",
            messages: [{role: "user", content: userMessage}],
        })
    }

    // Send POST request to API, get response and set the response as paragraph text
    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const response = data.choices[0].message.content.trim();
            // Append the response to the chatbox
            chatbox.appendChild(createChatLi(response, "incoming"));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        })
        .catch(error => {
            console.error("Error:", error);
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

//Date and time daily update function
function updateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedDateTime = now.toLocaleDateString('en-US', options);
    dateTimeElement.textContent = formattedDateTime;
}

setInterval(updateTime, 1000);
updateTime();