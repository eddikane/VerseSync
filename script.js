// Imports the Firebase function needed to start VerseSync
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

// Imports the Firestore tools used by VerseSync
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";


// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5afYG6rzXLbWuhKaXZzD81l6dgyupQKQ",
    authDomain: "versesync-4fdbd.firebaseapp.com",
    projectId: "versesync-4fdbd",
    storageBucket: "versesync-4fdbd.firebasestorage.app",
    messagingSenderId: "112642198904",
    appId: "1:112642198904:web:b9854a2cd291232f808c8d"
};


// Starts Firebase for VerseSync
const app = initializeApp(firebaseConfig);


// Connects VerseSync to Firestore
const db = getFirestore(app);



/* =========================
   DATA
   ========================= */

/*
Stores the weekly study schedule.
Each object represents one study week.
*/
const studyWeeks = [
    {
        weekNumber: 1,
        weekDate: "October 26–November 1",
        scripture: "Jeremiah 31–33; 36–39; Lamentations 1; 3",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/44?lang=eng"
    },    
    {
        weekNumber: 2,
        weekDate: "November 2–8",
        scripture: "Ezekiel 1–3; 33–34; 36–37; 47",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/45?lang=eng",
    },
    {
        weekNumber: 3,
        weekDate: "November 9–15",
        scripture: "Daniel 1–7",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/46?lang=eng",
    },
    {
        weekNumber: 4,
        weekDate: "November 16-22",
        scripture: "Hosea 1–6; 10–14; Joel",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/47?lang=eng"
    },
    {
        weekNumber: 5,
        weekDate: "November 23-29",
        scripture: "Amos; Obadiah; Jonah",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/48?lang=eng"
    }    
];


/*
Stores the insights currently loaded from Firestore.
This array is replaced whenever fresh data is loaded.
*/
let insights = [];


// Loads all saved insights from Firestore
async function loadInsights() {
    const querySnapshot = await getDocs(collection(db, "insights"));

    // Clears old local data before loading fresh Firestore data
    insights = [];

    querySnapshot.forEach(function(document) {
        insights.push({
            id: document.id,
            ...document.data()
        });
    });

    displayInsights();
}


/*
Tracks which study week the user is viewing.
Week numbers start at 1 while array indexes start at 0.
*/
let currentWeek = 1;



/* =========================
   DOM ELEMENT REFERENCES
   ========================= */

// Week navigation buttons
const nextWeekButton = document.querySelector("#next-week");
const previousWeekButton = document.querySelector("#previous-week");

// Current week information
const weekTitle = document.querySelector("#week-title");
const weekReading = document.querySelector("#week-reading");

// Current week's scripture link
const scriptureLink = document.querySelector("#scripture-link");

// Insight form inputs
const nameInput = document.querySelector("#name");
const scriptureInput = document.querySelector("#scripture_reference");
const insightInput = document.querySelector("#insight");

// Insight submission form
const insightForm = document.querySelector("#insight-form");

// Container for the insight cards
const insightsList = document.querySelector("#insights-list");



/* =========================
   DISPLAY FUNCTIONS
   ========================= */

/*
Updates the date, scripture reading, and link
for the currently selected week.
*/
function updateWeekDisplay() {

    // Subtract 1 because array indexes start at 0
    weekTitle.textContent = studyWeeks[currentWeek - 1].weekDate;

    // Displays the scripture reading
    weekReading.textContent =
        `Read ${studyWeeks[currentWeek - 1].scripture}`;

    // Updates the scripture study link
    scriptureLink.href =
        studyWeeks[currentWeek - 1].scriptureUrl;
}


/*
Rebuilds the visible insight cards
using the current insights array.
*/
function displayInsights() {

    // Clears the current cards before rebuilding them
    insightsList.innerHTML = "";


    // Keeps only insights belonging to the current week
    const currentWeekInsights = insights.filter(function(insight) {
        return insight.weekNumber === currentWeek;
    });


    // Builds one card for each insight
    currentWeekInsights.forEach(function(insight) {

        /* -------------------------
           INSIGHT CARD
           ------------------------- */

        // Creates one insight card
        const insightCard = document.createElement("div");

        // Applies the card styling
        insightCard.classList.add("insight-card");


        /* -------------------------
           AUTHOR
           ------------------------- */

        // Creates the author name
        const authorName = document.createElement("p");

        authorName.classList.add("author-name");

        // Displays the author
        authorName.textContent = insight.author;


        /* -------------------------
           SCRIPTURE REFERENCE
           ------------------------- */

        // Creates the scripture reference
        const scriptureReference = document.createElement("p");

        scriptureReference.classList.add("scripture-reference");

        scriptureReference.textContent = insight.scripture;


        /* -------------------------
           INSIGHT TEXT
           ------------------------- */

        // Creates the main insight text
        const insightText = document.createElement("p");

        insightText.classList.add("insight-text");

        insightText.textContent = insight.text;


        /* -------------------------
           EDIT BUTTON
           ------------------------- */

        // Creates the Edit button
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Edit";


        // Updates this insight when Edit is clicked
        editButton.addEventListener("click", async function() {
            const updatedText = prompt("Edit your insight:", insight.text);

            // Stops if the user cancels or enters empty text
            if (!updatedText || !updatedText.trim()) {
                return;
            }

            // Updates this specific Firestore document
            await updateDoc(doc(db, "insights", insight.id), {
                text: updatedText
            });

            // Reloads the latest Firestore data
            await loadInsights();
        });


        /* -------------------------
           DELETE BUTTON
           ------------------------- */

        // Creates the Delete button
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";


        // Deletes this insight when Delete is clicked
        deleteButton.addEventListener("click", async function() {
            const confirmed = confirm(
                "Are you sure you want to delete this insight?"
            );

            // Stops if the user chooses Cancel
            if (!confirmed) {
                return;
            }

            // Deletes this specific Firestore document
            await deleteDoc(doc(db, "insights", insight.id));

            // Reloads the latest Firestore data
            await loadInsights();
        });


        /* =========================
           REPLIES
           ========================= */

        // Container for this insight's replies
        const repliesList = document.createElement("div");
        repliesList.classList.add("replies-list");


        // Creates an empty replies array if one does not exist
        if (!insight.replies) {
            insight.replies = [];
        }


        // Displays each reply
        insight.replies.forEach(function(reply) {

            // Reply author's name
            const replyAuthor = document.createElement("p");

            replyAuthor.classList.add("reply-author");

            replyAuthor.textContent = reply.author;


            // Reply message
            const replyMessage = document.createElement("p");

            replyMessage.classList.add("reply-text");

            replyMessage.textContent = reply.text;


            // Adds the reply to the replies container
            repliesList.append(replyAuthor, replyMessage);
        });


        /* =========================
           REPLY FORM
           ========================= */

        // Creates a reply form for this insight
        const replyForm = document.createElement("form");
        replyForm.classList.add("reply-form");


        // Input for the person's name
        const replyNameInput = document.createElement("input");

        replyNameInput.type = "text";

        replyNameInput.placeholder = "Your name";


        // Text box for the reply
        const replyTextInput = document.createElement("textarea");

        replyTextInput.placeholder = "Write a reply...";


        // Creates the Reply button
        const replyButton = document.createElement("button");

        replyButton.type = "submit";
        replyButton.textContent = "Reply";


        // Adds the fields and button to the form
        replyForm.append(
            replyNameInput,
            replyTextInput,
            replyButton
        );


        /* =========================
           REPLY SUBMISSION
           ========================= */

        // Runs when this reply form is submitted
        replyForm.addEventListener("submit", async function(event) {

            // Prevents the page from refreshing
            event.preventDefault();


            // Gets the reply form values
            const replyName = replyNameInput.value;
            const replyText = replyTextInput.value;


            // Prevents empty or space-only replies
            if (!replyName.trim() || !replyText.trim()) {
                console.log("Please complete all reply fields.");
                return;
            }


            // Creates the new reply object
            const newReply = {
                author: replyName,
                text: replyText
            };


            // Adds the new reply to this insight
            insight.replies.push(newReply);


            // Saves the updated replies to Firestore
            await updateDoc(doc(db, "insights", insight.id), {
                replies: insight.replies
            });


            // Reloads the latest Firestore data
            await loadInsights();
        });


        /* =========================
           BUILD INSIGHT CARD
           ========================= */

        // Adds the insight information to the card
        insightCard.append(
            authorName,
            scriptureReference,
            insightText,
            repliesList,
            editButton,
            deleteButton
        );


        // Adds the reply form below the insight
        insightCard.append(replyForm);


        // Adds the completed card to the page
        insightsList.append(insightCard);
    });
}



/* =========================
   INITIAL PAGE SETUP
   ========================= */

// Displays the correct week when the page loads
updateWeekDisplay();


// Loads saved Firestore insights when the page opens
loadInsights();



/* =========================
   EVENT LISTENERS
   ========================= */


/* -------------------------
   NEXT WEEK BUTTON
   ------------------------- */

// Runs when Next Week is clicked
nextWeekButton.addEventListener("click", function() {

    // Prevents moving past the final study week
    if (currentWeek < studyWeeks.length) {

        // Moves forward one week
        currentWeek++;

        // Updates the displayed week
        updateWeekDisplay();

        // Displays insights for the new week
        displayInsights();
    }
});


/* -------------------------
   PREVIOUS WEEK BUTTON
   ------------------------- */

// Runs when Previous Week is clicked
previousWeekButton.addEventListener("click", function() {

    // Prevents moving before Week 1
    if (currentWeek > 1) {

        // Moves backward one week
        currentWeek--;

        // Updates the displayed week
        updateWeekDisplay();

        // Displays insights for the selected week
        displayInsights();
    }
});



/* =========================
   MAIN INSIGHT FORM
   ========================= */

// Runs when a new insight is submitted
insightForm.addEventListener("submit", async function(event) {

    // Prevents the page from refreshing
    event.preventDefault();


    // Gets the values entered in the form
    const userName = nameInput.value;
    const scriptureReference = scriptureInput.value;
    const insightText = insightInput.value;


    // Prevents empty or space-only submissions
    if (
        !userName.trim() ||
        !scriptureReference.trim() ||
        !insightText.trim()
    ) {
        console.log("Please complete all fields.");
        return;
    }


    /*
    Creates the new insight object.
    weekNumber connects it to the current study week.
    */
    const newInsight = {
        author: userName,
        scripture: scriptureReference,
        text: insightText,
        replies: [],
        weekNumber: currentWeek
    };


    // Saves the new insight to Firestore
    await addDoc(collection(db, "insights"), newInsight);


    // Reloads Firestore so the new insight appears immediately
    await loadInsights();


    // Clears the form after the insight is saved
    nameInput.value = "";
    scriptureInput.value = "";
    insightInput.value = "";
});