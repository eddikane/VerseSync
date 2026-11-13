# Overview

VerseSync is a web application designed to make collaborative scripture study easier. The application allows users to view the current Come, Follow Me study schedule from The Church of Jesus Christ of Latter-day Saints, move between different study weeks, and share scripture insights with others.

For this version of VerseSync, I rebuilt the application as a server-side web app using Node.js, Express, and EJS. The server handles requests, retrieves data from Firebase Cloud Firestore and also dynamically generates the HTML that is sent to the browser.

My purpose for creating this software was to learn how web applications work beyond client-side JavaScript. I wanted to better understand server-side programming, routing, templates, handling user input, and connecting a web application to a database.

[Software Demo Video](http://youtube.link.goes.here)

# How to Run
1. Make sure Node.js is installed on your computer.
2. Clone or download this repository.
3. Open a terminal in the project folder.
4. Install the required packages:
   ```bash
   npm install
5. Add a Firebase service account file named:
"serviceAccountKey.json" to the root folder of the project.
6. Start the Node.js server: "node server.js"
7. Open a web browser and go to: "http://localhost:3000"

# Web Pages

# Home Page
The Home page displays the selected Come, Follow Me study week and scripture reading. Users can move between study weeks using the Previous Week and Next Week buttons. The content is dynamically generated using Express and EJS.

# Shared Insights Page
The Shared Insights page displays insights stored in Firebase Cloud Firestore for the selected study week. Users can select different weeks, submit new insights, edit existing insights and delete insights.
The Home and Shared Insights pages are connected through navigation links and Express routes.

# Development Environment

I developed VerseSync using Visual Studio Code on Windows.
The project uses JavaScript, Node.js, Express, EJS, HTML, CSS, Firebase Cloud Firestore, and the Firebase Admin SDK. Git and GitHub were used for version control and storing the project repository.

# Useful Websites
Node.js Documentation — https://nodejs.org/docs/latest/api/
Express Documentation — https://expressjs.com/
EJS Documentation — https://ejs.co/
Firebase Documentation — https://firebase.google.com/docs
Firebase Admin SDK Documentation — https://firebase.google.com/docs/admin/setup

# Future Work
- Add user authentication so each person can manage only their own insights.
- Add replies or discussion threads underneath individual insights.
- Improve the design and mobile responsiveness of the application.
- Automatically determine the current study week based on the current date.
- Deploy the Node.js version of VerseSync so it can be used online instead of only through the local server.

# AI Use Disclosure
I used ChatGPT as a learning and development assistant while working on this project. I used it to help explain unfamiliar concepts, troubleshoot errors, review code, and understand technologies such as Node.js, Express, EJS, and Firebase Admin.
I wrote, tested, and modified the project code myself while using the explanations and feedback from the AI model to better understand how the application works.