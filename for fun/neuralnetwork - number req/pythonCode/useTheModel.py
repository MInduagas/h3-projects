from keras.models import load_model
import json
import numpy as np
from keras.utils import to_categorical
import sys

# Load the model
model = load_model('model.h5')

# Load the data
data = json.loads(sys.stdin)

# Convert the data to numpy arrays
# data format: {image:[]}
training_data = data['trainingData']

json.dump(data, sys.stdout)

# Convert the data to numpy arrays

