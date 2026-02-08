import csv
import os

from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker
from dotenv import load_dotenv

load_dotenv()

if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

def main():
    print("Starting import... please wait")

    f = open("books.csv")
    reader = csv.reader(f)

    next(reader)

    for isbn, title, author, year in reader:
        db.execute(text("INSERT INTO books (isbn, title, author, year) VALUES (:isbn, :title, :author, :year)"),{"isbn":isbn, "title":title, "author":author, "year":year})

        print(f"Added {title} - {author} - {year}")

    db.commit()
    print("Success! Books have been imported to the database.")

if __name__ == "__main__":
    main()