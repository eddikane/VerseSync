/* DATA */

const studyWeeks = [
    {
        weekNumber: 1,
        scripture: "Isaiah 58–66",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/42?lang=eng",
    },
    {
        weekNumber: 2,
        scripture: "Jeremiah 1–3; 7; 16–18; 20",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/43?lang=eng",       
    },
    {
        weekNumber: 3,
        scripture: "Jeremiah 31–33; 36–39; Lamentations 1; 3",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/44?lang=eng",
    }
];

/* Uses "let" instead of "const" because the default array may 
 be replaced with saved localStorage data */
let insights = [];

// Retrieves any previously saved insights from localStorage
const savedInsights = localStorage.getItem("insights");

// Replaces the default insights with saved data if localStorage contains any
if (savedInsights) {
    insights = JSON.parse(savedInsights);
}

// Tracks which study week the user is currently viewing
let currentWeek = 1;

/* DOM elements*/
const nextWeekButton = document.querySelector("#next-week");

const previousWeekButton = document.querySelector("#previous-week");

const weekTitle = document.querySelector("#week-title");

const weekReading = document.querySelector("#week-reading");

const scriptureLink = document.querySelector("#scripture-link");

const nameInput = document.querySelector("#name");

const scriptureInput = document.querySelector("#scripture_reference");

const insightInput = document.querySelector("#insight");

const insightForm = document.querySelector("#insight-form");

const insightsList = document.querySelector("#insights-list");

// Display Functions
function updateWeekDisplay() {
    if (currentWeek === 1) {
        weekTitle.textContent = "This Week";
    } else {
        weekTitle.textContent = `Week ${currentWeek}`;
    }

    weekReading.textContent = `Read ${studyWeeks[currentWeek - 1].scripture}`;

    // Updates the scripture link to match the week currently being viewed
    scriptureLink.href = studyWeeks[currentWeek - 1].scriptureUrl;
};


function displayInsights() {
    // Clears the current insight cards so they don't duplicate when the list is re-rendered
    insightsList.innerHTML = "";   

    // Loops through every saved insight
    insights.forEach(function(insight) {

        // Creates a new div that will become one displayed insight card
        const insightCard = document.createElement("div");

        // Creates a new "insight-card" class for insight cards
        insightCard.classList.add("insight-card");

        // creates a new <p>
        const authorName = document.createElement("p");

        // Gives it a css class
        authorName.classList.add("author-name");

        // puts the current insight’s author name inside the paragraph.
        authorName.textContent = insight.author;

        // new <p>, class, saves scriptureReference for scriptures object
        const scriptureReference = document.createElement("p");
        scriptureReference.classList.add("scripture-reference");
        scriptureReference.textContent = insight.scripture;

        // new <p>, class, saves insightText for text object
        const insightText = document.createElement("p");
        insightText.classList.add("insight-text");
        insightText.textContent = insight.text;

        // Creates a container to hold replies for this specific insight
        const repliesList = document.createElement("div");
        repliesList.classList.add("replies-list");

        // Gives older saved insights an empty replies array if they don't have one yet
        if (!insight.replies) {
            insight.replies = [];
        }

        // Loops through the replies that belong to this insight
        insight.replies.forEach(function(reply) {

            // Creates a paragraph for the reply author's name
            const replyAuthor = document.createElement("p");
            replyAuthor.classList.add("reply-author");
            replyAuthor.textContent = reply.author;

            // Creates a paragraph for the reply message
            const replyMessage = document.createElement("p");
            replyMessage.classList.add("reply-text");
            replyMessage.textContent = reply.text;

            // Adds the reply author's name and message into the replies container
            repliesList.append(replyAuthor, replyMessage);

        })

        // Creates a form for submitting a reply to this specific insight
        const replyForm = document.createElement("form");
        replyForm.classList.add("reply-form");

        // Creates an input for the name of the person writing the reply
        const replyNameInput = document.createElement("input");

        replyNameInput.type = "text";
        replyNameInput.placeholder = "Your name";

        // Creates a text area where the user can write their reply
        const replyTextInput = document.createElement("textarea");

        replyTextInput.placeholder = "Write a reply...";

        // Creates the button used to submit a reply
        const replyButton = document.createElement("button");

        // Makes the button submit the reply form and gives it visible text
        replyButton.type = "submit";
        replyButton.textContent = "Reply";

        // Adds the reply inputs and submit button into the reply form
        replyForm.append(replyNameInput, replyTextInput, replyButton);

        // Handles submitting a reply for this specific insight
        replyForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // Reads the name and reply text entered in this reply form
            const replyName = replyNameInput.value;
            const replyText = replyTextInput.value;

            // Stops the reply from submitting if either field is empty
            if(!replyName.trim() || !replyText.trim()) {
                console.log("Please Complete all reply fields. ");
                return;
            };

            // Creates a new reply object from the submitted form values
            const newReply = {
                author: replyName,
                text: replyText
            };

            // Adds the new reply to the replies array for this specific insight
            insight.replies.push(newReply);

            // Saves the updated insights and replies so they persist after a page refresh
            localStorage.setItem("insights", JSON.stringify(insights));

            // Re-renders the insight cards so the new reply appears immediately
            displayInsights();


        });

        // adding authorName, scriptureReference, insightText into the Insights Card (div)
        insightCard.append(authorName, scriptureReference, insightText, repliesList);

        // Adds the reply form underneath the insight content
        insightCard.append(replyForm);

        // Adds the finished card into insightsList
        insightsList.append(insightCard);
    })
};

// Displays the current week's reading and sets its scripture link when the page loads
updateWeekDisplay();

// Renders the saved insights when the page first loads
displayInsights();

// Event Listeners
nextWeekButton.addEventListener("click", function() {
    if (currentWeek < studyWeeks.length) {
        currentWeek++;
        updateWeekDisplay();
    }
});

previousWeekButton.addEventListener("click", function() {
    if (currentWeek > 1) {
        currentWeek--;
        updateWeekDisplay();
}}); 

insightForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const userName = nameInput.value;
    const scriptureReference = scriptureInput.value;
    const insightText = insightInput.value;

    if (!userName.trim() || !scriptureReference.trim() || !insightText.trim()) {
        console.log("Please complete all fields.");
        return;
    }

    const newInsight = {
    author: userName,
    scripture: scriptureReference,
    text: insightText,
    replies: []
    };

    insights.push(newInsight);

    // Saves the updated insights array in localStorage so 
    // it can persist after a page refresh
    localStorage.setItem("insights", JSON.stringify(insights));

    // Retrieves previously saved insights from localStorage when the page loads
    displayInsights(); 

    // Clears the form after a successful submission
    nameInput.value = "";
    scriptureInput.value = "";
    insightInput.value = "";
});