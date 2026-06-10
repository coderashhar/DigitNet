import requests
from PIL import Image
import numpy as np

# Create a dummy image
img = Image.new('RGB', (100, 100), color = 'white')
img.save('test_img.jpg')

# Send to backend
with open('test_img.jpg', 'rb') as f:
    files = {'file': ('test_img.jpg', f, 'image/jpeg')}
    try:
        response = requests.post('http://localhost:8000/predict', files=files)
        print("Status Code:", response.status_code)
        print("Response:", response.text)
    except Exception as e:
        print("Error:", e)
