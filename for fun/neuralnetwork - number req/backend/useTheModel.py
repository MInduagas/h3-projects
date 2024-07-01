from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import json

app = Flask(__name__)
model = tf.keras.models.load_model('Modelv2.h5') # mnistModel or model if its home made

def process_input(request_data):
    """Process the input data from the request."""
    try:
        image_data = request_data['image']
        image_data = np.array(image_data)
        image_data = image_data.reshape(-1, 28, 28) # or 1, 784 and if its mnsit its -1, 28, 28
        return image_data
    except KeyError:
        raise ValueError("Invalid input: no 'image' key in request data")
    except Exception as e:
        raise ValueError(f"Error processing input: {e}")

def make_prediction(image_data):
    """Make a prediction using the model."""
    predictions = model.predict(image_data)
    return predictions.tolist()

@app.route('/predict', methods=['POST'])
def predict():
    """Handle the /predict route."""
    data = request.get_json()
    print(data)
    try:
        image_data = process_input(data)
        result = make_prediction(image_data)
        return jsonify({'result': result})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)