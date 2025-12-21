import os
import cv2
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import random
from pyzbar import pyzbar # 👈 New import!

# --- Settings ---
IMG_SIZE = 128

# --- Function to Decode and Print ---
def check_qr_code(image, image_type):
    print(f"--- Checking {image_type} QR Code ---")
    decoded_objects = pyzbar.decode(image)
    
    if decoded_objects:
        for obj in decoded_objects:
            # Print the data found in the QR code
            data = obj.data.decode('utf-8')
            print(f"✅ Success! Decoded Data: {data}")
        return True
    else:
        print("❌ Failure! Could not decode.")
        return False

# --- Load the saved model ---
print("Loading the trained model...")
model = tf.keras.models.load_model('qr_healer_model.h5')

# --- Load one random test image ---
damaged_images_path = "qrcodes/damaged"
clean_images_path = "qrcodes/clean"

# Get a random image to test
all_files = os.listdir(damaged_images_path)
random_filename = random.choice(all_files)
print(f"\nTesting with image: {random_filename}\n")

# Load the damaged image
damaged_img = cv2.imread(os.path.join(damaged_images_path, random_filename), cv2.IMREAD_GRAYSCALE)
damaged_img_normalized = damaged_img.astype('float32') / 255.
damaged_img_reshaped = np.reshape(damaged_img_normalized, (1, IMG_SIZE, IMG_SIZE, 1))

# Load the original clean image for comparison
original_img = cv2.imread(os.path.join(clean_images_path, random_filename), cv2.IMREAD_GRAYSCALE)

# --- Predict/Heal the image ---
print("Healing the QR code with the AI model...")
healed_img_normalized = model.predict(damaged_img_reshaped)
healed_img = (healed_img_normalized.squeeze() * 255).astype('uint8')
print("Healing complete!")

# --- The Moment of Truth: Try to decode the QR codes ---
print("\n" + "="*30)
check_qr_code(original_img, "Original")
check_qr_code(damaged_img, "Damaged")
check_qr_code(healed_img, "AI Healed")
print("="*30 + "\n")


# --- Display the visual results ---
plt.figure(figsize=(12, 5))
plt.suptitle('QR Code Healing Results', fontsize=16)

# Original Clean QR
ax = plt.subplot(1, 3, 1)
ax.imshow(original_img, cmap='gray')
ax.set_title('Original Clean')
ax.axis('off') # Hide axes

# Damaged QR
ax = plt.subplot(1, 3, 2)
ax.imshow(damaged_img, cmap='gray')
ax.set_title('Damaged Input')
ax.axis('off')

# Healed QR
ax = plt.subplot(1, 3, 3)
ax.imshow(healed_img, cmap='gray')
ax.set_title('AI Healed Output ✨')
ax.axis('off')

plt.show()