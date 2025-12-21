import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, UpSampling2D
from tensorflow.keras.models import Model
from sklearn.model_selection import train_test_split

# --- Settings ---
IMG_SIZE = 128
EPOCHS = 20 # How many times to loop through the data. Start with 20, increase for better results.
BATCH_SIZE = 32 # How many images to process at once.

# --- Load Data ---
def load_images_from_folder(folder):
    images = []
    for filename in sorted(os.listdir(folder)):
        img = cv2.imread(os.path.join(folder, filename), cv2.IMREAD_GRAYSCALE)
        if img is not None:
            images.append(img)
    return np.array(images)

print("Loading data...")
clean_images = load_images_from_folder("qrcodes/clean")
damaged_images = load_images_from_folder("qrcodes/damaged")

# Normalize pixel values to be between 0 and 1 (better for the AI)
clean_images = clean_images.astype('float32') / 255.
damaged_images = damaged_images.astype('float32') / 255.

# Reshape for TensorFlow (add a channel dimension)
clean_images = np.reshape(clean_images, (len(clean_images), IMG_SIZE, IMG_SIZE, 1))
damaged_images = np.reshape(damaged_images, (len(damaged_images), IMG_SIZE, IMG_SIZE, 1))

# Split data into training and testing sets
x_train, x_test, y_train, y_test = train_test_split(damaged_images, clean_images, test_size=0.2, random_state=42)

# --- Build the Autoencoder Model ---
print("Building the model...")
input_img = Input(shape=(IMG_SIZE, IMG_SIZE, 1))

# Encoder
x = Conv2D(32, (3, 3), activation='relu', padding='same')(input_img)
x = MaxPooling2D((2, 2), padding='same')(x)
x = Conv2D(64, (3, 3), activation='relu', padding='same')(x)
encoded = MaxPooling2D((2, 2), padding='same')(x)

# Decoder
x = Conv2D(64, (3, 3), activation='relu', padding='same')(encoded)
x = UpSampling2D((2, 2))(x)
x = Conv2D(32, (3, 3), activation='relu', padding='same')(x)
x = UpSampling2D((2, 2))(x)
decoded = Conv2D(1, (3, 3), activation='sigmoid', padding='same')(x)

autoencoder = Model(input_img, decoded)
autoencoder.compile(optimizer='adam', loss='binary_crossentropy')
autoencoder.summary() # Prints a cool summary of the model layers

# --- Train the Model ---
print("Starting training... this might take a bit! ⏳")
autoencoder.fit(x_train, y_train,
                epochs=EPOCHS,
                batch_size=BATCH_SIZE,
                shuffle=True,
                validation_data=(x_test, y_test))

# --- Save the Trained Model ---
print("Saving the model...")
autoencoder.save('qr_healer_model.h5')

print("✅ Training complete! Model saved as qr_healer_model.h5")