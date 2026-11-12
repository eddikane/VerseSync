const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
const PORT = 3000;

app.get("/", function(req, res) {
    res.render("index", {
        appName: "VerseSync"
    });
});

app.get("/insights", function(req, res) {
    const insights = [
        {
            author: "Edward",
            scripture: "Daniel 1:8",
            text: "Daniel stayed committed to his beliefs."
        },
        {
            author: "John",
            scripture: "Daniel 3:17",
            text: "Faith does not always depend on knowing the outcome."
        }
    ];

    res.render("insights", {
        pageTitle: "Shared Insights",
        insights: insights
    });
});



app.listen(PORT, function() {
    console.log(`VerseSync server is running on port ${PORT}`);
});