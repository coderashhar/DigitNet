from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = FastAPI(title="Digit Recognition API")

# Setup CORS to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.h5')
if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
else:
    model = None

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess the image to match the MNIST dataset format:
    - Grayscale
    - 28x28 pixels
    - Invert colors (MNIST has white digits on black background, 
      while typical canvases/uploads have black digits on white background)
    - Normalize to [0, 1]
    - Reshape to (1, 28, 28, 1)
    """
    # Convert to grayscale
    img = image.convert('L')
    
    # Resize to 28x28
    img = img.resize((28, 28))
    
    # Convert to numpy array
    img_array = np.array(img)
    
    # Invert colors if necessary (assuming white background, black digit)
    # If the image is already white digit on black background, this step should be conditional.
    # For a typical drawing canvas with white background and black pen, we invert.
    # If mean pixel value is > 127, it's mostly white, so invert.
    if np.mean(img_array) > 127:
        img_array = 255 - img_array
        
    # Normalize
    img_array = img_array.astype('float32') / 255.0
    
    # Reshape
    img_array = img_array.reshape(1, 28, 28, 1)
    
    return img_array

@app.post("/predict")
async def predict_digit(file: UploadFile = File(...)):
    if model is None:
        return {"error": "Model not loaded on the server"}
        
    try:
        # Read the image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Preprocess the image
        processed_image = preprocess_image(image)
        
        # Predict
        predictions = model.predict(processed_image)
        predicted_digit = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        
        # Get all probabilities for detailed view if needed
        probabilities = {str(i): float(predictions[0][i]) for i in range(10)}
        
        return {
            "prediction": predicted_digit,
            "confidence": confidence,
            "probabilities": probabilities
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def read_root():
    return {"status": "Backend API is running and model is ready"}
