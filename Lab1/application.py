import os
import requests
from flask import Flask, session, render_template, request, redirect, flash
from flask_session import Session
from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash

load_dotenv()

app = Flask(__name__)

app.secret_key = "my_secret_key"

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/register", methods=["GET","POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if not username:
            return render_template("register.html", error="Username is missing!")
        if not password:
            return render_template("register.html", error="Password is missing!")
        
        check_user = db.execute(text("SELECT * FROM users WHERE username=:username"),{"username":username}).fetchone()

        if check_user:
            return render_template("register.html",error="This username has already been taken. Choose another.")
        
        hashed_password = generate_password_hash(password)

        db.execute(text("INSERT INTO users (username, password) VALUES(:username, :password)"), {"username":username, "password":hashed_password})
        db.commit()

        flash("Registration Successful! You can login now.")
        return redirect("/login")

    else:
        return render_template("register.html")

@app.route("/login", methods=["GET","POST"])
def login():

    if request.method == "POST":
        input_username = request.form.get("username")
        input_password = request.form.get("password")

        if not input_username:
            return render_template("login.html", error="Please provide your username")
        elif not input_password:
            return render_template("login.html", error="Please provide your password")
        
        rows = db.execute(text("SELECT * FROM users WHERE username=:username"), {"username":input_username}).mappings().all()

        if len(rows)!=1 or not check_password_hash(rows[0]["password"], input_password):
            return render_template("login.html", error="Invalid username and/or password")
        
        session["user_id"] = rows[0]["id"]
        session["user_name"] = rows[0]["username"]

        return redirect("/")

    else:
        return render_template("login.html")

@app.route("/search", methods=["POST"])
def search():
    if "user_id" not in session:
        return redirect("/login")
    
    query = request.form.get("query")

    if not query:
        return render_template("index.html", error="Please enter a search term!")
    
    search_query = f"%{query}%"

    books = db.execute(text("SELECT * FROM books WHERE isbn ILIKE :q OR title ILIKE :q OR author ILIKE :q"), {"q":search_query}).mappings().all()

    return render_template("search.html", books=books, query=query)

@app.route("/book/<isbn>", methods=["GET", "POST"])
def book(isbn):
    if "user_id" not in session:
        return redirect("/login")
    
    row = db.execute(text("SELECT * FROM books WHERE isbn = :isbn"),{"isbn":isbn}).mappings().fetchone()

    if row is None:
        return render_template("book.html", error="No such book exists")
    
    book_id = row["id"]

    if request.method == "POST":
        rating = request.form.get("rating")
        comment = request.form.get("comment")
        user_id = session["user_id"]

        existing_review = db.execute(text("SELECT * FROM reviews WHERE user_id = :uid AND book_id = :bid"), {"uid":user_id, "bid":book_id}).fetchone()

        if existing_review:
            flash("You have already reviewed this book!")

        else:
            db.execute(text("INSERT INTO reviews (rating, comment, user_id, book_id) VALUES(:rating, :comment, :uid, :bid)"),{"rating":rating, "comment":comment, "uid":user_id, "bid": book_id})
            db.commit()
            flash("Review Submitted successfully!")

        return redirect(f"/book/{isbn}")
    
    reviews = db.execute(text("SELECT r.rating, r.comment, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.book_id = :bid"),{"bid":book_id}).mappings().all()

    google_data = {}
    try:
        response = requests.get("https://www.googleapis.com/books/v1/volumes", params={"q":f"isbn:{isbn}"})
        data = response.json()

        if "items" in data:
            volume_info = data["items"][0]["volumeInfo"]
            google_data = {
                "average_rating": volume_info.get("averageRating", "N/A"),
                "ratings_count": volume_info.get("ratingsCount", 0),
                "description": volume_info.get("description", "No description available.")
            }

    except Exception as e:
        print(f"Error fetching Google Data: {e}")
        google_data = {"average_rating": "N/A", "ratings_count": 0, "description": "Couldn't load description."}

    return render_template("book.html", book=row, reviews=reviews, google_data=google_data)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")