from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

USERNAME = os.getenv('API_KEY_ID')
PASSWORD = os.getenv('API_KEY_SECRET')

BASE_URL = 'https://data.calgary.ca/api/v3/views/c2es-76ed/query.geojson'

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)