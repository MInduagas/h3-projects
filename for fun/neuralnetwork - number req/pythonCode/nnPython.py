import json
import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Activation, Flatten
from keras.utils import to_categorical
from keras.datasets import mnist

with open('datav2.json') as f:
    data = json.load(f)

training_data = data['trainingData']

x_train = []
y_train = []

for item in training_data:
    image = item['image']
    value = item['value']

    x_train.append(image)
    y_train.append(value)

x_train = np.array(x_train)
y_train = np.array(y_train)

# Convert the data to categorical
y_train = to_categorical(y_train, num_classes=10)

x_train = np.reshape(x_train, (-1, 28, 28))

model = Sequential()

# Add the layers
model.add(Flatten(input_shape=(28, 28)))  # Flatten the 28x28 images
model.add(Dense(784, activation='relu'))  # 28x28 = 784
model.add(Dense(128, activation='relu')) # 128 neurons
model.add(Dense(64, activation='relu')) # 64 neurons 
model.add(Dense(32, activation='relu')) # 32 neurons
model.add(Dense(10, activation='softmax')) # 10 neurons (one for each class) 0-9

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(x_train,y_train, epochs=1000, batch_size=32)

# Save the model
model.save('Modelv2.h5')

'''  code for custom model usage
# Load the data
with open('data.json') as f:
    data = json.load(f)

# Convert the data to numpy arrays
training_data = data['trainingData']

x_train = []
y_train = []

for item in training_data:
    image = item['image']
    value = item['value']

    x_train.append(image)
    y_train.append(value)

x_train = np.array(x_train)
y_train = np.array(y_train)

# Convert the data to categorical
y_train = to_categorical(y_train, num_classes=10)
# Add the layers
model.add(Dense(784, input_dim=784, activation='relu')) # 28x28 = 784
model.add(Dense(128, activation='relu')) # 128 neurons
model.add(Dense(64, activation='relu')) # 64 neurons 
model.add(Dense(32, activation='relu')) # 32 neurons
model.add(Dense(10, activation='softmax')) # 10 neurons (one for each class) 0-9
'''

''' code for mnist model usage
(x_train,y_train), (xrawd, yrawd) = mnist.load_data()

x_train = x_train / 255.0
xrawd = xrawd / 255.0

y_train = to_categorical(y_train, num_classes=10)
yrawd = to_categorical(yrawd, num_classes=10)

# Create the model
model = Sequential()

# Add the layers
model.add(Flatten(input_shape=(28, 28)))  # Flatten the 28x28 images
model.add(Dense(784, activation='relu'))  # 28x28 = 784
model.add(Dense(128, activation='relu'))  # 128 neurons
model.add(Dense(64, activation='relu'))  # 64 neurons 
model.add(Dense(32, activation='relu'))  # 32 neurons
model.add(Dense(10, activation='softmax'))  # 10 neurons (one for each class) 0-9
'''