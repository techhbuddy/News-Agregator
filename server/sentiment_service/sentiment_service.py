from flask import Flask, request, jsonify
from transformers import pipeline
import torch

app = Flask(__name__)

# Load the sentiment analysis pipeline
classifier = pipeline("sentiment-analysis")

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        if not texts:
            return jsonify({'error': 'No texts provided'}), 400
        
        # Perform sentiment analysis
        results = classifier(texts)
        
        # Map Hugging Face labels to consistent output
        sentiment_results = []
        for text, result in zip(texts, results):
            label = result['label'].lower()
            # Convert to 'positive', 'negative', or 'neutral'
            sentiment = 'neutral' if label == 'neutral' else label
            sentiment_results.append({
                'text': text,
                'sentiment': sentiment,
                'confidence': result['score']
            })
        
        return jsonify({'sentiments': sentiment_results}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)