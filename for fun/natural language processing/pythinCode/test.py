import json
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation

# Load the data
with open('data.json') as f:
    data = json.load(f)

# console.log(data)
print(data)