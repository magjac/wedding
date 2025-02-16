#!/usr/bin/env python3

from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import csv
import io

app = Flask(__name__)
app.config.from_object('config.Config')
db = SQLAlchemy(app)
CORS(app)  # Enable Cross-Origin Resource Sharing

class RSVP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    attending = db.Column(db.Boolean, nullable=False)
    food_allergy = db.Column(db.String(120), nullable=False)

@app.route('/rsvp', methods=['POST'])
def rsvp():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    attending = data.get('attending')
    food_allergy = data.get('food_allergy')
    new_rsvp = RSVP(name=name, email=email, attending=attending, food_allergy=food_allergy)
    db.session.add(new_rsvp)
    db.session.commit()
    return jsonify({'message': 'RSVP received'}), 200

@app.route('/download_csv', methods=['GET'])
def download_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['id', 'name', 'email', 'attending', 'food_allergy'])
    rsvps = RSVP.query.all()
    for rsvp in rsvps:
        writer.writerow([rsvp.id, rsvp.name, rsvp.email, rsvp.attending, rsvp.food_allergy])
    output.seek(0)
    byte_output = io.BytesIO(output.getvalue().encode())
    return send_file(byte_output, mimetype='text/csv', download_name='rsvp.csv', as_attachment=True)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
