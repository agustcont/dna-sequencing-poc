# src/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
import sqlite3
import random

app = Flask(__name__)
app.secret_key = 'supersecretkey'
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

class User(UserMixin):
    def __init__(self, id, username, role):
        self.id = id
        self.username = username
        self.role = role

@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if user:
        return User(user['id'], user['username'], user['role'])
    return None

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    role = data['role']

    conn = get_db_connection()
    conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
                 (username, password, role))
    conn.commit()
    conn.close()
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password'], password):
        user_obj = User(user['id'], user['username'], user['role'])
        login_user(user_obj)
        return jsonify({"message": "Login successful!", "role": user['role']}), 200

    return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/customers', methods=['GET'])
@login_required
def get_customers():
    if current_user.role != 'business':
        return jsonify({"message": "Unauthorized!"}), 403

    conn = get_db_connection()
    customers = conn.execute('SELECT id, username FROM users WHERE role = "customer"').fetchall()
    conn.close()
    return jsonify([dict(row) for row in customers]), 200

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful!"}), 200

@app.route('/submit_sample', methods=['POST'])
@login_required
def submit_sample():
    if current_user.role != 'business':
        return jsonify({"message": "Unauthorized!"}), 403

    data = request.json
    sample = data['sample']
    analysis_type = data['analysisType']
    customer_id = data['customerId']
    result = run_analysis(sample, analysis_type)
    
    conn = get_db_connection()
    conn.execute('INSERT INTO samples (sample, analysisType, result, customer_id, business_id) VALUES (?, ?, ?, ?, ?)', 
                 (sample, analysis_type, result, customer_id, current_user.id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Sample submitted and analyzed successfully!"}), 200

@app.route('/get_samples', methods=['GET'])
@login_required
def get_samples():
    conn = get_db_connection()
    if current_user.role == 'business':
        samples = conn.execute('SELECT * FROM samples WHERE business_id = ?', (current_user.id,)).fetchall()
    else:
        samples = conn.execute('SELECT * FROM samples WHERE customer_id = ?', (current_user.id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in samples]), 200

def run_analysis(sample, analysis_type):
    # Simulate running analysis and generate dummy results
    result = f"Analysis result for {sample} with {analysis_type}: {random.randint(1, 100)}"
    return result

if __name__ == '__main__':
    conn = get_db_connection()
    # Drop the tables if they exist and create new ones
    conn.execute('DROP TABLE IF EXISTS users')
    conn.execute('DROP TABLE IF EXISTS samples')
    conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)')
    conn.execute('CREATE TABLE samples (id INTEGER PRIMARY KEY, sample TEXT, analysisType TEXT, result TEXT, customer_id INTEGER, business_id INTEGER)')
    conn.commit()
    conn.close()
    app.run(debug=True, host='0.0.0.0')  # Change host to 0.0.0.0
