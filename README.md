# Overview

VerseSync is a collaborative scripture-study web application designed to help individuals and groups stay organized, share insights, and study together in one place.

The application allows users to follow weekly scripture-reading schedules, open direct Gospel Library links, submit study insights, and reply to insights shared by others. VerseSync uses Firebase Cloud Firestore to store shared study content in the cloud so that insights and replies can persist across users, devices, and sessions.

Users can select a study week, review the assigned readings, follow links to the scriptures, and contribute thoughts or replies through the web interface. The application dynamically updates the page using JavaScript and retrieves shared data from Firestore.

The purpose of building VerseSync was to strengthen my understanding of JavaScript web development while learning how to connect a front-end application to a cloud database. This project also helped me gain experience working with asynchronous operations, CRUD functionality, application structure, debugging, and cloud-based data persistence.

[Software Demo Video](https://youtu.be/Ow3lMlk5jss)

# Cloud Database

VerseSync uses **Firebase Cloud Firestore** as its cloud database.

Cloud Firestore is a NoSQL document database that stores information in collections and documents. It allows the application to store shared study data remotely instead of relying only on browser-based local storage.

For VerseSync, Firestore is used to store study insights and replies so that information can be shared between different users and remain available across sessions.

The database is organized around collections containing documents for shared study content. Each insight document stores information related to a user's submitted study thought, such as the study week, scripture reference or topic, insight text, and other information needed by the application.

Replies are associated with study insights so that users can respond to one another and create simple discussion threads. The application performs CRUD operations against Firestore to create, retrieve, update, and delete cloud-based data.

# Development Environment

VerseSync was developed primarily using **Visual Studio Code**.

The main development tools used for the project include:

- Visual Studio Code
- Git
- GitHub
- Firebase
- Cloud Firestore
- Firebase Hosting
- Google Chrome Developer Tools

The application was written using:

- JavaScript
- HTML
- CSS

The Firebase JavaScript SDK is used to connect the application to Firebase services and communicate with Cloud Firestore.

JavaScript is responsible for the application's logic, DOM manipulation, event handling, filtering, form processing, and communication with the cloud database.

HTML provides the structure of the web application, while CSS is used to control the layout and appearance of the interface.

# Useful Websites

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Firestore Documentation](https://firebase.google.com/docs/firestore)
- [MDN Web Docs](https://developer.mozilla.org/)
- [GitHub Documentation](https://docs.github.com/)

# Future Work

- Add user authentication so users can have individual accounts and identities.
- Improve the user interface and mobile responsiveness.
- Add more collaborative study features such as reactions, notifications, or group-specific study spaces.
- Improve error handling and validation for user-submitted data.
- Add additional Firestore security rules and access controls.
- Continue expanding scripture-study schedules and content.
