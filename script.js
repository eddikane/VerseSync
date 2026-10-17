/* =========================================================
   DATA
   ========================================================= */

/*
Stores the study schedule used by the website.

Each object represents one study week and contains:
- weekNumber: internal number used to connect insights to a week
- weekDate: date range shown to the user
- scripture: reading assignment shown on the page
- scriptureUrl: Gospel Library / Come, Follow Me link for that week
*/
const studyWeeks = [
    {
        weekNumber: 1,
        weekDate: "October 12–18",
        scripture: "Isaiah 58–66",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/42?lang=eng",
    },
    {
        weekNumber: 2,
        weekDate: "October 19–25",
        scripture: "Jeremiah 1–3; 7; 16–18; 20",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/43?lang=eng",
    },
    {
        weekNumber: 3,
        weekDate: "October 26–November 1",
        scripture: "Jeremiah 31–33; 36–39; Lamentations 1; 3",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/44?lang=eng",
    },
    {
        weekNumber: 4,
        weekDate: "November 2–8",
        scripture: "Ezekiel 1–3; 33–34; 36–37; 47",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/45?lang=eng",
    },
    {
        weekNumber: 5,
        weekDate: "November 9–15",
        scripture: "Daniel 1–7",
        scriptureUrl: "https://beta.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/46?lang=eng",
    }
];


/*
Stores every submitted insight.

"let" is used instead of "const" because this array may be replaced
with previously saved data from localStorage when the page loads.
*/
let insights = [];


// Retrieves previously saved insights from the browser.
const savedInsights = localStorage.getItem("insights");


/*
If saved data exists, JSON.parse() converts the stored string
back into a normal JavaScript array and replaces the empty array.
*/
if (savedInsights) {
    insights = JSON.parse(savedInsights);
}


/*
Tracks which study week the user is currently viewing.
The visible week numbers start at 1, while array indexes start at 0.
That is why studyWeeks[currentWeek - 1] is used throughout the file.
*/
let currentWeek = 1;



/* =========================================================
   DOM ELEMENT REFERENCES
   ========================================================= */

/*
These variables connect JavaScript to specific HTML elements.
document.querySelector() finds an element in the page so JavaScript
can read from it, change it, or listen for user actions.
*/

// Week navigation buttons
const nextWeekButton = document.querySelector("#next-week");
const previousWeekButton = document.querySelector("#previous-week");

// Current week's date and scripture reading
const weekTitle = document.querySelector("#week-title");
const weekReading = document.querySelector("#week-reading");

// Link that opens the current week's Gospel Library reading
const scriptureLink = document.querySelector("#scripture-link");

// Main insight form inputs
const nameInput = document.querySelector("#name");
const scriptureInput = document.querySelector("#scripture_reference");
const insightInput = document.querySelector("#insight");

// Main form used to submit new insights
const insightForm = document.querySelector("#insight-form");

// Container where JavaScript-generated insight cards are displayed
const insightsList = document.querySelector("#insights-list");



/* =========================================================
   DISPLAY FUNCTIONS
   ========================================================= */


/*
Updates the week information shown on the page.

Whenever currentWeek changes, this function updates:
- the date range
- the scripture reading
- the scripture link
*/
function updateWeekDisplay() {

    /*
    currentWeek starts at 1, but arrays start at index 0.
    Subtracting 1 lets us access the correct studyWeeks object
    without changing currentWeek itself.
    */
    weekTitle.textContent = studyWeeks[currentWeek - 1].weekDate;

    // Displays the scripture reading assigned to the current week.
    weekReading.textContent =
        `Read ${studyWeeks[currentWeek - 1].scripture}`;

    // Updates the Gospel Library link to match the current week.
    scriptureLink.href =
        studyWeeks[currentWeek - 1].scriptureUrl;
}


/*
Rebuilds the visible insight cards.

This function is called:
- when the page first loads
- when the user changes weeks
- after an insight is submitted
- after a reply is submitted

Instead of manually editing the HTML, JavaScript recreates the visible
cards using the information stored inside the insights array.
*/
function displayInsights() {

    /*
    Removes the currently displayed cards before rebuilding them.

    Without this, calling displayInsights() multiple times would
    repeatedly add duplicate cards to the page.
    */
    insightsList.innerHTML = "";


    /*
    Creates a new array containing only insights that belong
    to the week currently being viewed.
    */
    const currentWeekInsights = insights.filter(function(insight) {
        return insight.weekNumber === currentWeek;
    });


    /*
    Goes through each insight belonging to the current week
    and builds one visible insight card for it.
    */
    currentWeekInsights.forEach(function(insight) {

        /* -------------------------
           CREATE INSIGHT CARD
           ------------------------- */

        // Creates the outer <div> that will contain one complete insight.
        const insightCard = document.createElement("div");

        // Applies the CSS styling defined for .insight-card.
        insightCard.classList.add("insight-card");


        /* -------------------------
           AUTHOR
           ------------------------- */

        // Creates a paragraph that will display the insight author's name.
        const authorName = document.createElement("p");

        // Applies the CSS styling for author names.
        authorName.classList.add("author-name");

        // Inserts the current insight object's author into the paragraph.
        authorName.textContent = insight.author;


        /* -------------------------
           SCRIPTURE REFERENCE
           ------------------------- */

        // Creates a paragraph for the scripture reference.
        const scriptureReference = document.createElement("p");

        // Applies the CSS styling for scripture references.
        scriptureReference.classList.add("scripture-reference");

        // Displays the scripture reference stored in this insight object.
        scriptureReference.textContent = insight.scripture;


        /* -------------------------
           INSIGHT TEXT
           ------------------------- */

        // Creates a paragraph for the main insight/testimony text.
        const insightText = document.createElement("p");

        // Applies the CSS styling for the insight body.
        insightText.classList.add("insight-text");

        // Displays the text stored in the current insight object.
        insightText.textContent = insight.text;


        /* =====================================================
           REPLIES
           ===================================================== */

        /*
        Creates a container that will hold every reply
        belonging specifically to this insight.
        */
        const repliesList = document.createElement("div");
        repliesList.classList.add("replies-list");


        /*
        Older insights may have been saved before the replies feature
        existed. If an insight does not yet contain a replies array,
        create an empty one so the rest of the code can safely use it.
        */
        if (!insight.replies) {
            insight.replies = [];
        }


        /*
        Loops through every reply belonging to this insight
        and creates the HTML elements needed to display it.
        */
        insight.replies.forEach(function(reply) {

            // Creates the paragraph displaying the reply author's name.
            const replyAuthor = document.createElement("p");

            // Applies the reply-author CSS styling.
            replyAuthor.classList.add("reply-author");

            // Displays the author's name from the current reply object.
            replyAuthor.textContent = reply.author;


            // Creates the paragraph displaying the reply message.
            const replyMessage = document.createElement("p");

            // Applies the reply-text CSS styling.
            replyMessage.classList.add("reply-text");

            // Displays the message from the current reply object.
            replyMessage.textContent = reply.text;


            /*
            Places both reply paragraphs inside this insight's
            replies container.
            */
            repliesList.append(replyAuthor, replyMessage);
        });


        /* =====================================================
           REPLY FORM
           ===================================================== */

        /*
        Creates a separate reply form for this specific insight.

        Because this code runs once for every insight, each card gets
        its own form and replies are added to the correct insight.
        */
        const replyForm = document.createElement("form");
        replyForm.classList.add("reply-form");


        // Creates an input where the person replying enters their name.
        const replyNameInput = document.createElement("input");

        // Makes this a normal text input.
        replyNameInput.type = "text";

        // Shows helpful temporary text before the user types.
        replyNameInput.placeholder = "Your name";


        // Creates a textarea where the user can type their reply.
        const replyTextInput = document.createElement("textarea");

        // Shows helpful temporary text before the user types.
        replyTextInput.placeholder = "Write a reply...";


        // Creates the button used to submit the reply form.
        const replyButton = document.createElement("button");

        /*
        Makes the button submit the reply form when clicked
        and displays the word "Reply" on the button.
        */
        replyButton.type = "submit";
        replyButton.textContent = "Reply";


        /*
        Places the name field, reply textarea, and submit button
        inside the reply form.
        */
        replyForm.append(
            replyNameInput,
            replyTextInput,
            replyButton
        );


        /* =====================================================
           REPLY FORM EVENT
           ===================================================== */

        /*
        Runs whenever this specific reply form is submitted.
        */
        replyForm.addEventListener("submit", function(event) {

            /*
            Stops the browser's normal form behavior,
            which would otherwise refresh the page.
            */
            event.preventDefault();


            // Reads the current values typed into the reply form.
            const replyName = replyNameInput.value;
            const replyText = replyTextInput.value;


            /*
            Prevents blank replies.

            trim() removes spaces from the beginning and end,
            so a user cannot submit a field containing only spaces.
            */
            if (!replyName.trim() || !replyText.trim()) {
                console.log("Please complete all reply fields.");
                return;
            }


            /*
            Packages the submitted reply information into one object.
            */
            const newReply = {
                author: replyName,
                text: replyText
            };


            /*
            Adds the new reply to the replies array belonging
            to this specific insight.
            */
            insight.replies.push(newReply);


            /*
            Saves the entire updated insights array.

            Replies are nested inside their parent insight objects,
            so saving insights also saves all replies.
            */
            localStorage.setItem("insights", JSON.stringify(insights));


            /*
            Rebuilds the insight cards immediately so the newly
            submitted reply appears without refreshing the page.
            */
            displayInsights();
        });


        /* =====================================================
           BUILD FINAL INSIGHT CARD
           ===================================================== */

        /*
        Places the main insight information and existing replies
        inside the insight card.
        */
        insightCard.append(
            authorName,
            scriptureReference,
            insightText,
            repliesList
        );


        // Places the reply form underneath the insight and its replies.
        insightCard.append(replyForm);


        /*
        Adds the completed insight card to the main insight container,
        making it visible on the webpage.
        */
        insightsList.append(insightCard);
    });
}



/* =========================================================
   INITIAL PAGE SETUP
   ========================================================= */

/*
Runs once when the JavaScript file first loads.

This makes sure the page displays the correct date,
scripture reading, and scripture link immediately.
*/
updateWeekDisplay();


/*
Displays any insights loaded from localStorage for the
currently selected week when the page first opens.
*/
displayInsights();



/* =========================================================
   EVENT LISTENERS
   ========================================================= */


/* -------------------------
   NEXT WEEK BUTTON
   ------------------------- */

/*
Runs whenever the user clicks Next Week.
*/
nextWeekButton.addEventListener("click", function() {

    /*
    Prevents currentWeek from moving beyond the number
    of weeks stored in the studyWeeks array.
    */
    if (currentWeek < studyWeeks.length) {

        // Moves forward one week.
        currentWeek++;

        // Updates the visible week date, reading, and scripture link.
        updateWeekDisplay();

        /*
        Re-renders the insight list so only posts belonging
        to the newly selected week are shown.
        */
        displayInsights();
    }
});


/* -------------------------
   PREVIOUS WEEK BUTTON
   ------------------------- */

/*
Runs whenever the user clicks Previous Week.
*/
previousWeekButton.addEventListener("click", function() {

    /*
    Prevents the user from navigating backward past Week 1.
    */
    if (currentWeek > 1) {

        // Moves backward one week.
        currentWeek--;

        // Updates the visible week date, reading, and scripture link.
        updateWeekDisplay();

        /*
        Re-renders the insight list so only posts belonging
        to the selected week are shown.
        */
        displayInsights();
    }
});


/* =========================================================
   MAIN INSIGHT FORM
   ========================================================= */

/*
Runs whenever the user submits a new insight.
*/
insightForm.addEventListener("submit", function(event) {

    /*
    Stops the browser's normal form behavior,
    which would refresh the page.
    */
    event.preventDefault();


    /*
    Reads the current values entered into the three form fields.
    */
    const userName = nameInput.value;
    const scriptureReference = scriptureInput.value;
    const insightText = insightInput.value;


    /*
    Prevents the form from submitting if any required field
    is empty or contains only spaces.
    */
    if (
        !userName.trim() ||
        !scriptureReference.trim() ||
        !insightText.trim()
    ) {
        console.log("Please complete all fields.");
        return;
    }


    /*
    Creates one insight object containing all information
    needed to display and save the post.

    weekNumber connects the insight to whichever study week
    the user was viewing when the insight was submitted.

    replies starts as an empty array and will later hold
    reply objects belonging to this specific insight.
    */
    const newInsight = {
        author: userName,
        scripture: scriptureReference,
        text: insightText,
        replies: [],
        weekNumber: currentWeek
    };


    /*
    Adds the newly created insight object to the main insights array.
    */
    insights.push(newInsight);


    /*
    Saves the updated insights array to the browser.

    JSON.stringify() converts the JavaScript array into a string
    because localStorage stores text values.
    */
    localStorage.setItem("insights", JSON.stringify(insights));


    /*
    Rebuilds the visible insight list immediately so the
    newly submitted post appears without refreshing the page.
    */
    displayInsights();


    /*
    Clears all three form fields after a successful submission
    so the form is ready for another insight.
    */
    nameInput.value = "";
    scriptureInput.value = "";
    insightInput.value = "";
});