// Import Express and the Firebase Admin tools used by the server.
const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Load the private Firebase service account credentials.
const serviceAccount = require("./serviceAccountKey.json");


// Connect this Node.js server to Firebase.
initializeApp({
    credential: cert(serviceAccount)
});

// Get access to the Firestore database.
const db = getFirestore();


// Create the Express application.
const app = express();

// Tell Express that EJS will be used to create dynamic HTML pages.
app.set("view engine", "ejs");

// Allow Express to serve files from the public folder, such as style.css.
app.use(express.static("public"));

// Allows Express to read information submitted through HTML forms.
// Submitted values become available through req.body.
app.use(express.urlencoded({ extended: true }));

// Port used by the local server.
// The website will run at http://localhost:3000.
const PORT = 3000;


// ---------------------------------------------------------
// STUDY SCHEDULE DATA
// ---------------------------------------------------------

// Stores the available Come, Follow Me study weeks.
// Each object contains a week number, dates, and scripture reading.
const studyWeeks = [
    {
        weekNumber: 1,
        dates: "Nov 9–15",
        scripture: "Daniel 1–7"
    },
    {
        weekNumber: 2,
        dates: "Nov 16–22",
        scripture: "Hosea 1–6; 10–14; Joel"
    },
    {
        weekNumber: 3,
        dates: "Nov 23–29",
        scripture: "Amos; Obadiah; Jonah"
    },
    {
        weekNumber: 4,
        dates: "Nov 30–Dec 6",
        scripture: "Micah; Nahum; Habakkuk; Zephaniah"
    },
    {
        weekNumber: 5,
        dates: "Dec 7–13",
        scripture: "Haggai 1–2; Zechariah 1–4; 7–14"
    },
    {
        weekNumber: 6,
        dates: "Dec 14–20",
        scripture: "Malachi"
    }
];


// ---------------------------------------------------------
// HOME PAGE
// ---------------------------------------------------------

// Handles GET requests to the home page.
//
// Example:
// http://localhost:3000/?week=2
//
// The week value in the URL determines which study week is displayed.
app.get("/", function(req, res) {

    // Get the week number from the URL.
    // Number() changes it from a string into a number.
    // If no week is provided, use week 1.
    let weekNumber = Number(req.query.week) || 1;

    // Prevent the user from going below the first available week.
    if (weekNumber < 1) {
        weekNumber = 1;
    }

    // Prevent the user from going beyond the last available week.
    if (weekNumber > studyWeeks.length) {
        weekNumber = studyWeeks.length;
    }
    
    // Arrays start at index 0.
    // Week 1 is therefore studyWeeks[0], week 2 is studyWeeks[1], etc.
    const currentWeek = studyWeeks[weekNumber - 1];

    // Render views/index.ejs.
    // These values become available inside the EJS page.
    res.render("index", {
        appName: "VerseSync",
        currentWeek: currentWeek,
        weekNumber: weekNumber,
        totalWeeks: studyWeeks.length
    });
});


// ---------------------------------------------------------
// SHARED INSIGHTS PAGE
// ---------------------------------------------------------

// Handles GET requests to /insights.
//
// This route determines the selected week, gets that week's
// insights from Firestore, and sends them to insights.ejs.
app.get("/insights", async function(req, res) {
    try {

        // Get the selected week from the URL.
        // Use week 1 if no week was provided.
        let weekNumber = Number(req.query.week) || 1;

        // Keep the selected week inside the valid range.
        if (weekNumber < 1) {
            weekNumber = 1;
        }

        if (weekNumber > studyWeeks.length) {
            weekNumber = studyWeeks.length;
        }

        // Get the schedule information for the selected week.
        const currentWeek = studyWeeks[weekNumber - 1];

        // Ask Firestore for insights whose weekNumber
        // matches the week currently being viewed.
        const snapshot = await db
            .collection("insights")
            .where("weekNumber", "==", weekNumber)
            .get();

        // Create a normal JavaScript array to hold the results.
        const insights = [];

        // Go through every Firestore document that was returned.
        snapshot.forEach(function(document) {

            // Add the document ID and its stored data to the array.
            insights.push({
                id: document.id,
                ...document.data()
            });
        });

        // Render views/insights.ejs and give it all the data
        // needed to create the page.
        res.render("insights", {
            pageTitle: "Shared Insights",
            insights: insights,
            studyWeeks: studyWeeks,
            currentWeek: currentWeek,
            weekNumber: weekNumber,
            totalWeeks: studyWeeks.length
        });

    } catch (error) {

        // If something goes wrong while loading Firestore data,
        // show the error in the terminal and return an error response.
        console.error("Error loading insights:", error);
        res.status(500).send("Unable to load insights.");
    }
});


// ---------------------------------------------------------
// CREATE A NEW INSIGHT
// ---------------------------------------------------------

// Handles the form used to submit a new insight.
app.post("/insights", async function(req, res) {
    try {

        // Create an object using the values submitted by the form.
        // req.body contains the form input values.
        const newInsight = {
            author: req.body.author,
            scripture: req.body.scripture,
            text: req.body.text,

            // Form values arrive as strings, so Number()
            // converts the selected week into a number.
            weekNumber: Number(req.body.weekNumber),

            // Keeps the replies property from the previous
            // version of VerseSync.
            replies: []
        };

        // Add the new insight as a document in Firestore.
        await db.collection("insights").add(newInsight);

        // After saving, send the user back to the same study week.
        res.redirect(`/insights?week=${newInsight.weekNumber}`);

    } catch (error) {
        console.error("Error saving insight:", error);
        res.status(500).send("Unable to save insight.");
    }
});


// ---------------------------------------------------------
// EDIT AN INSIGHT
// ---------------------------------------------------------

// :id is a route parameter.
//
// Example:
// /insights/ABC123/edit
//
// In that example, req.params.id would contain "ABC123".
app.post("/insights/:id/edit", async function(req, res) {
    try {

        // Get the Firestore document ID from the URL.
        const insightId = req.params.id;

        // Create an object containing the updated form values.
        const updatedInsight = {
            author: req.body.author,
            scripture: req.body.scripture,
            text: req.body.text
        };

        // Find the correct Firestore document using its ID
        // and update it with the new information.
        await db
            .collection("insights")
            .doc(insightId)
            .update(updatedInsight);

        // Return the user to the same study week after editing.
        res.redirect(`/insights?week=${req.body.weekNumber}`);

    } catch (error) {
        console.error("Error updating insight:", error);
        res.status(500).send("Unable to update insight.");
    }
});


// ---------------------------------------------------------
// DELETE AN INSIGHT
// ---------------------------------------------------------

// Deletes one specific insight using its Firestore document ID.
app.post("/insights/:id/delete", async function(req, res) {
    try {

        // Read the document ID from the URL.
        const insightId = req.params.id;

        // Find that document in Firestore and delete it.
        await db
            .collection("insights")
            .doc(insightId)
            .delete();

        // Return the user to the same study week afterward.
        res.redirect(`/insights?week=${req.body.weekNumber}`);

    } catch (error) {
        console.error("Error deleting insight:", error);
        res.status(500).send("Unable to delete insight.");
    }
});


// ---------------------------------------------------------
// START SERVER
// ---------------------------------------------------------

// Start Express and wait for requests on port 3000.
app.listen(PORT, function() {
    console.log(`VerseSync server is running on port ${PORT}`);
});