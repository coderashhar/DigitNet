import os
import tensorflow as tf
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, MaxPooling2D, Dropout
from tensorflow.keras.utils import to_categorical

def train_and_save_model():
    print("Loading MNIST dataset...")
    (X_train, y_train), (X_test, y_test) = mnist.load_data()

    # Preprocessing
    print("Preprocessing data...")
    X_train = X_train.astype('float32') / 255.0
    X_test = X_test.astype('float32') / 255.0

    X_train_cnn = X_train.reshape(-1, 28, 28, 1)
    X_test_cnn = X_test.reshape(-1, 28, 28, 1)

    y_train_cat = to_categorical(y_train, 10)
    y_test_cat = to_categorical(y_test, 10)

    # User's CNN Architecture
    print("Building model...")
    cnn = Sequential([
        Conv2D(32, kernel_size=(3,3), activation="relu", input_shape=(28,28,1)),
        MaxPooling2D(pool_size=(2,2)),
        Conv2D(64, kernel_size=(3,3), activation="relu"),
        MaxPooling2D(pool_size=(2,2)),
        Flatten(),
        Dense(128, activation="relu"),
        Dropout(0.5),
        Dense(10, activation="softmax")
    ])

    cnn.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

    # Train model
    print("Training model...")
    # Using 3 epochs to speed up for prototyping instead of 5, accuracy reaches > 98% anyway
    cnn.fit(X_train_cnn, y_train_cat, epochs=3, batch_size=32, validation_data=(X_test_cnn, y_test_cat), verbose=1)

    # Save model
    model_path = os.path.join(os.path.dirname(__file__), 'model.h5')
    print(f"Saving model to {model_path}...")
    cnn.save(model_path)
    print("Model saved successfully!")

if __name__ == "__main__":
    train_and_save_model()
