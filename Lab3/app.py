from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv
from requests import Request, Session

load_dotenv()

USERNAME = os.getenv('API_KEY_ID')
PASSWORD = os.getenv('API_KEY_SECRET')

BASE_URL = 'https://data.calgary.ca/api/v3/views/c2es-76ed/query.geojson'

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/permits')
def get_permits():
    start_date = request.args.get('start')
    end_date = request.args.get('end')

    payload = {
        "query": f"SELECT * WHERE issueddate >= '{start_date}' AND issueddate <= '{end_date}'",
        "page": {
            "pageNumber": 1,
            "pageSize": 1000
        }
    }

    response = requests.post(
        BASE_URL,
        json=payload,
        auth=(USERNAME, PASSWORD),
        headers={"Content-Type": "application/json"}
    )

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data from API'}), 500

if __name__ == '__main__':
    app.run(debug=True)