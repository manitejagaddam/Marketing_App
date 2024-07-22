import os
import pandas as pd
import numpy as np
import pickle
import re
import nltk
import flask
from flask import Flask, request, render_template, redirect, url_for, flash, send_file, jsonify
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from tensorflow.keras.preprocessing.text import one_hot
from tensorflow.keras.preprocessing.sequence import pad_sequences
import chardet
import logging
from nltk.tokenize import sent_tokenize
import re

import requests
from bs4 import BeautifulSoup

from flask_cors import CORS

import links_data




# Download required NLTK data
nltk.download('stopwords')

app = Flask(__name__)
app.secret_key = 'supersecretkey'

CORS(app)
# Load the model
with open('sentiment_analysis.pkl', 'rb') as file:
    loaded_model = pickle.load(file)


# url = 'https://en.wikipedia.org/wiki/Samantha_Ruth_Prabhu'




def preprocessing1(text, stopWords=None):
    if stopWords is None:
        stopWords = set(stopwords.words('english'))
    
    text = text.lower()
    text = re.sub(r'\w*\d\w*', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9]', ' ', text)
    text = re.sub(r'[0-9]', ' ', text)
    # text = re.sub(r'[^a-zA-Z0-9]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = word_tokenize(text)
    text = [i for i in text if i != '']
    text = [i for i in text if i not in stopWords]
    text = [word for word in text if len(word) > 3]
    return ' '.join(text)

# Parameters
voc_size = 10000
feature_dimension = 50
max_length = 21

def predict_sentiments(texts, model):
    processed_texts = [preprocessing1(text) for text in texts]
    ohe_rep = [one_hot(text, voc_size) for text in processed_texts]
    padded_docs = pad_sequences(ohe_rep, maxlen=max_length, padding='pre')
    predictions = model.predict(padded_docs)
    return predictions

# Set up the upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def home():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    
    file = request.files['file']
    
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    
    if file and file.filename.endswith('.csv'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        flash('File successfully uploaded')
        return redirect(url_for('predict', filename=file.filename))
    else:
        flash('Invalid file format. Please upload a CSV file.')
        return redirect(request.url)

logging.basicConfig(level=logging.INFO)

def detect_encoding(file_path):
    try:
        with open(file_path, 'rb') as file:
            result = chardet.detect(file.read())
        return result['encoding']
    except Exception as e:
        logging.error(f"Error detecting encoding: {e}")
        return 'utf-8'

@app.route('/predict/<filename>')
def predict(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        encoding = detect_encoding(filepath)
        try:
            df = pd.read_csv(filepath, encoding=encoding)
        except UnicodeDecodeError:
            logging.warning(f"UnicodeDecodeError with encoding {encoding}. Trying 'utf-8'.")
            df = pd.read_csv(filepath, encoding='utf-8')
        
        if 'Timestamp' in df.columns:
            df.drop('Timestamp', axis=1, inplace=True)
        
        if 'Review' not in df.columns:
            flash('CSV file must contain a "Review" column')
            return redirect(url_for('home'))
        
        test_texts = df['Review'].tolist()
        predictions = predict_sentiments(test_texts, loaded_model)
        df['Output'] = ["good" if np.max(pred) > 0.3 else "bad" for pred in predictions]

        result_file = os.path.join(UPLOAD_FOLDER, 'results_' + filename)
        df.to_csv(result_file, index=False)

        return send_file(result_file, as_attachment=True)
    
    except pd.errors.EmptyDataError:
        flash('Uploaded file is empty. Please upload a valid CSV file.')
        return redirect(url_for('home'))
    except FileNotFoundError:
        flash('The file was not found.')
        return redirect(url_for('home'))
    except Exception as e:
        flash(f'Error processing file: {e}')
        logging.error(f"Error processing file {filename}: {e}")
        return redirect(url_for('home'))

 

def links_analysis(url):
    # Send a GET request to the URL
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the page content with BeautifulSoup
            response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the page content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract text content from the main body
        main_content = soup.get_text(separator=' ', strip=True)
        
        # Tokenize the text into sentences
        texts = sent_tokenize(main_content)
        
        # Predict sentiments for each sentence
        predictions = predict_sentiments(texts, loaded_model)
        
        # Print the type and shape of the predictions
        print("Predictions type:", type(predictions))
        print("Predictions shape:", predictions.shape)
        
        # Flatten the predictions if necessary
        if predictions.ndim > 1:
            predictions = predictions.flatten()
        
        print("Flattened predictions:", predictions)
        
        # Convert predictions to binary values (0 or 1)
        binary_predictions = np.where(predictions > 0.3, 1, 0)
        
        # Print the binary predictions
        print("Binary predictions:", binary_predictions)
        
        # Count occurrences of 0s and 1s
        counts = np.bincount(binary_predictions)
        
        # Extract counts for 0s and 1s
        count_zeros = counts[0] if len(counts) > 0 else 0
        count_ones = counts[1] if len(counts) > 1 else 0
        
        
        # Print the counts
        print("Count Ones  - ", count_ones)
        print("Count Zeros - ", count_zeros)
        
        return count_zeros, count_ones
    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")





@app.route('/predict_text', methods=['POST'])
def predict_text():
    if request.is_json:
        data = request.get_json()
        user_input = data.get('userInput', "")
        # print(user_input)
        if not user_input:
            return jsonify({"error": "No user input provided"}), 400
        
        texts = [user_input]
        if texts[0][:4] == 'http':
            url = texts[0]
            zeros, ones = links_analysis(url)
            good = ((ones)/(ones + zeros))*100
            bad = ((zeros)/(ones + zeros))*100
            
            result = {"text": user_input, "prediction":  f"good : {good}\nbad : {bad}" }
            return jsonify(result)
        else:
        
            # print(texts)
            predictions = predict_sentiments(texts, loaded_model)
            result = {"text": user_input, "prediction": "good" if np.max(predictions) > 0.3 else "bad"}
            return jsonify(result)
    else:
        return jsonify({"error": "Request content-type must be application/json"}), 400
    
    
    
    
    
   

# links_analysis()




if __name__ == '__main__':
    app.run(debug=True, port=5002)

    