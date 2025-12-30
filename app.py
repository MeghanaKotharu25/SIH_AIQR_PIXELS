from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf

import base64
import io
from PIL import Image
try:
    from pyzbar import pyzbar
    PYZBAR_AVAILABLE = True
except ImportError:
    pyzbar = None
    PYZBAR_AVAILABLE = False
    print("⚠️  pyzbar not available - QR scanning disabled")
app = Flask(__name__)
CORS(app)

# Load the trained U-Net model
MODEL_PATH = '../qr_healer_model.h5'
IMG_SIZE = 128

print("Loading U-Net QR healing model...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

def decode_qr(image):
    """Attempt to decode QR code from image"""
    if not PYZBAR_AVAILABLE:
        return None, False
    decoded_objects = pyzbar.decode(image)
    if decoded_objects:
        return decoded_objects[0].data.decode('utf-8'), True
    return None, False

def preprocess_image(img):
    """Preprocess image for the model"""
    # Convert to grayscale if needed
    if len(img.shape) == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Resize to model input size
    img_resized = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    
    # Normalize
    img_normalized = img_resized.astype('float32') / 255.0
    
    # Reshape for model input
    img_input = np.reshape(img_normalized, (1, IMG_SIZE, IMG_SIZE, 1))
    
    return img_input

def heal_qr_image(damaged_img):
    """Use U-Net model to heal damaged QR code"""
    if model is None:
        return None, 0.0
    
    # Preprocess
    img_input = preprocess_image(damaged_img)
    
    # Predict
    healed_img_normalized = model.predict(img_input, verbose=0)
    
    # Convert back to uint8
    healed_img = (healed_img_normalized.squeeze() * 255).astype('uint8')
    
    # Calculate confidence (rough estimate based on contrast)
    confidence = float(np.std(healed_img) / 128.0)  # Normalized std dev
    confidence = min(max(confidence, 0.0), 1.0)
    
    return healed_img, confidence

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None
    })

@app.route('/api/scan-qr', methods=['POST'])
def scan_qr():
    """
    Scan QR code with optional AI reconstruction
    Expects: base64 encoded image in JSON
    Returns: decoded data, reconstruction status, confidence
    """
    try:
        # Get image data from request
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_data = data['image'].split(',')[1] if ',' in data['image'] else data['image']
        image_bytes = base64.b64decode(image_data)
        
        # Convert to numpy array
        image = Image.open(io.BytesIO(image_bytes))
        img_array = np.array(image)
        
        # Try to decode directly first
        decoded_data, success = decode_qr(img_array)
        
        if success:
            return jsonify({
                'success': True,
                'data': decoded_data,
                'reconstructed': False,
                'confidence': 1.0,
                'message': 'QR code scanned successfully'
            })
        
        # If direct scan failed, try AI reconstruction
        print("Direct scan failed. Attempting AI reconstruction...")
        
        if model is None:
            return jsonify({
                'success': False,
                'error': 'QR code damaged and model not available',
                'reconstructed': False
            }), 400
        
        # Heal the QR code
        healed_img, confidence = heal_qr_image(img_array)
        
        if healed_img is None:
            return jsonify({
                'success': False,
                'error': 'Reconstruction failed',
                'reconstructed': True
            }), 400
        
        # Try to decode healed image
        decoded_data, success = decode_qr(healed_img)
        
        if success:
            # Encode healed image to base64 for response
            _, buffer = cv2.imencode('.png', healed_img)
            healed_base64 = base64.b64encode(buffer).decode('utf-8')
            
            return jsonify({
                'success': True,
                'data': decoded_data,
                'reconstructed': True,
                'confidence': confidence,
                'healed_image': f'data:image/png;base64,{healed_base64}',
                'message': 'QR code reconstructed using AI'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'QR code too damaged to reconstruct',
                'reconstructed': True,
                'confidence': confidence
            }), 400
            
    except Exception as e:
        print(f"Error in scan_qr: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/fitting/<fitting_id>', methods=['GET'])
def get_fitting(fitting_id):
    """Mock endpoint to get fitting details"""
    # This would normally query UDM/TMS databases
    # For now, return mock data
    return jsonify({
        'fitting_id': fitting_id,
        'type': 'Elastic Rail Clip',
        'material': 'Spring Steel',
        'vendor': 'Bharat Forge Ltd',
        'batch': 'BATCH-A-2024',
        'install_date': '2024-02-01',
        'warranty_months': 24,
        'status': 'Active',
        'location': 'Delhi-Agra KM-45.2'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
