import sys
import joblib
import pickle
import json

import warnings

warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

def load_models(vectorizer_path, classifier_path):
    vectorizer = joblib.load(vectorizer_path)
    classifier = joblib.load(classifier_path)
    return vectorizer, classifier

def predict(vectorizer, classifier, text):
    # Vectorize the input text
    vectorized_text = vectorizer.transform([text])
    # Make a prediction
    prediction = classifier.predict(vectorized_text)
    return prediction[0]  # Assuming a single prediction is returned

if __name__ == "__main__":
    # Paths to your saved models
    vectorizer_path = 'tfidf_vectorizer.pkl'
    classifier_path = 'knn_classifier.pkl'

    # Load the vectorizer and classifier
    vectorizer, classifier = load_models(vectorizer_path, classifier_path)

    # Get the input text from the command line argument
    input_text = sys.argv[1]

    # Make prediction
    result = predict(vectorizer, classifier, input_text)

    # Output the prediction in JSON format
    print(json.dumps({"prediction": result}))
