# Project 1

# BookOrbit
**BookOrbit** is a web application designed for book lovers to discover, track, and review books. 
This project was build as a part of ENGO 651 - Advanced Geospatial Topics Course at the University of Calgary.

## Project Overview
* **Users:** Can register, log in, and log out securely.
* **Search:** Allows users to find books by ISBN, Title, or Author (supports partial matches).
* **Data:** A persistent PostgreSQL database stores users and book information.

## File Description

### Python Files
* **`application.py`**: The main controller for the application. It initializes the Flask app, configures the database connection, and defines all routes (URLs) such as `/login`, `/search`, and `/book/<isbn>`. It handles all server-side logic and SQL queries.
* **`import.py`**: A standalone script used to initialize the database. It reads `books.csv`, parses the data, and inserts records into the PostgreSQL `books` table using raw SQL.

### Templates (HTML)
* **`layout.html`**: The base template containing the navigation bar, footer, and flash message logic. All other pages extend this file to ensure a consistent look and feel.
* **`index.html`**: The landing page.
    * *Logged Out:* Shows a "Hero" section and feature cards explaining the app.
    * *Logged In:* Displays the main search bar and a personalized welcome message.
* **`register.html`**: A form for new users to create an account. Includes error handling for existing usernames.
* **`login.html`**: A form for existing users to authenticate. Clears the session upon arrival to ensure a fresh login.
* **`search.html`**: Displays a list of search results. Users can click on any book title to view its details.
* **`book.html`**: A detailed view for a specific book, showing its Title, Author, Year, and ISBN.

### Other
* **`requirements.txt`**: Lists all Python dependencies (Flask, SQLAlchemy, psycopg2) required to run the app.
* **`books.csv`**: The source dataset containing books (ISBN, Title, Author, Year).

## Techologies used
* **Backend:** Python, Flask
* **Database:** PostgreSQL, SQLAlchemy 
* **Frontend:** HTML5, Jinja2, Bootstrap 4
* **Security:** Werkzeug (Password Hashing)

---
**Developer:** Divya Bhavsar
ENGO 651 - Advanced Geospatial Topics
MEng Geomatics Engineering
University Of Calgary