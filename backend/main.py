from flask import Flask, jsonify, request
from flask_cors import CORS
from uuid import uuid4
from json import loads, dumps

import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firestore DB
cred = credentials.Certificate('key.json')
default_app = initialize_app(cred)
db = firestore.client()
receipts_ref = db.collection('receipts')

RESPONSE_OK = ({'success': True}, 200)

@app.route('/data', methods = ['GET'])
def get_receipts():
   print('Received GET')
   all_receipts = []
   for receipt in receipts_ref.stream():
      receipt_json = receipt.to_dict()
      receipt_json['rid'] = receipt.id
      all_receipts.append(receipt_json)

   res = jsonify({'receipts': all_receipts})
   res.headers.add('Access-Control-Allow-Origin', '*')
   return res

@app.route('/data', methods = ['POST'])
def add_receipt():
   print('Received POST')
   receipt_data = loads(request.data.decode())
   receipt_uuid = str(uuid4())
   receipts_ref.document(receipt_uuid).set(receipt_data)
   return RESPONSE_OK

@app.route('/data', methods = ['DELETE'])
def delete_receipt():
   print('Received DELETE')
   receipt_data = loads(request.data.decode())
   receipts_ref.document(receipt_data['rid']).delete()
   return RESPONSE_OK

if __name__ == '__main__':
   app.run()