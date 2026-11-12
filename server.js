const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.get("/", function(req, res) {
    res.render("index", {
        appName: "VerseSync"
    });
});

app.post("/insights", async function(req, res) {
    const { author, scripture, text } = req.body;

    await db.collection("insights").add({
        author,
        scripture,
        text
    });

    res.redirect("/insights");
});

app.get("/insights", async function(req, res) {
    const snapshot = await db.collection("insights").get();

    const insights = [];

    snapshot.forEach(function(document) {
        insights.push({
            id: document.id,
            ...document.data()
        });
    });

    res.render("insights", {
        pageTitle: "Shared Insights",
        insights: insights
    });
});

app.post("/insights", async function(req, res) {
    const newInsight = {
        author: req.body.author,
        scripture: req.body.scripture,
        text: req.body.text,
        replies: []
    };

    await db.collection("insights").add(newInsight);

    res.redirect("/insights");
});


app.listen(PORT, function() {
    console.log(`VerseSync server is running on port ${PORT}`);
});