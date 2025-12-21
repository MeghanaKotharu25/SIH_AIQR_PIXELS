import os
import qrcode
import cv2
import numpy as np
import random

# --- Settings ---
NUM_IMAGES = 1000  # Make more for a better model, maybe 5000?
IMG_SIZE = 128     # The size of our QR code images (128x128 pixels)
DAMAGE_LEVEL = 0.25 # How much of the image to mess up (25%)

# --- Create Directories ---
print("Creating directories...")
os.makedirs("qrcodes/clean", exist_ok=True)
os.makedirs("qrcodes/damaged", exist_ok=True)

# --- Damage Function ---
def add_damage(img):
    damaged_img = img.copy()
    height, width = damaged_img.shape
    num_pixels_to_damage = int(height * width * DAMAGE_LEVEL)
    
    for _ in range(num_pixels_to_damage):
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        # Flip the pixel color (white to black or black to white)
        damaged_img[y, x] = 255 - damaged_img[y, x]
        
    return damaged_img

# --- Main Loop ---
print(f"Generating {NUM_IMAGES} QR code pairs...")
for i in range(NUM_IMAGES):
    # Generate a random string for the QR code data
    data = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=20))
    
    # Create the QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(data)
    qr.make(fit=True)
    
    # Convert to an OpenCV image (grayscale)
    img = qr.make_image(fill='black', back_color='white')
    img_pil = img.convert('L')
    img_cv = np.array(img_pil)
    
    # Resize it to our standard size
    clean_img = cv2.resize(img_cv, (IMG_SIZE, IMG_SIZE), interpolation=cv2.INTER_AREA)
    
    # Add damage
    damaged_img = add_damage(clean_img)
    
    # Save both images
    filename = f"qr_{i}.png"
    cv2.imwrite(f"qrcodes/clean/{filename}", clean_img)
    cv2.imwrite(f"qrcodes/damaged/{filename}", damaged_img)

print("✅ Done generating data!")