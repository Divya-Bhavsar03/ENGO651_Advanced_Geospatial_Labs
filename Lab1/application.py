import os

from flask import Flask, session, render_template, request
from flask_session import Session
from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash

load_dotenv()

app = Flask(__name__)

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
            return "Username is missing!"
        if not password:
            return "Password is missing!"
        
        check_user = db.execute(text("SELECT * FROM users WHERE username=:username"),{"username":username}).fetchone()

        if check_user:
            return "This username has already been taken. Choose another."
        
        hashed_password = generate_password_hash(password)

        db.execute(text("INSERT INTO users (username, password) VALUES(:username, :password)"), {"username":username, "password":hashed_password})
        db.commit()

        return "Registration Successful! Proceed to Login!"

    else:
        return render_template("register.html")
