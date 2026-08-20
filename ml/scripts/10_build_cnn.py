# ============================================================
# 🌱 PLANTGUARD AI - CNN MODEL FROM SCRATCH
# ============================================================

from tensorflow.keras import layers, models


# ============================================================
# 1. MODEL CONFIGURATION
# ============================================================

IMAGE_HEIGHT = 224
IMAGE_WIDTH = 224
CHANNELS = 3

NUM_CLASSES = 15


# ============================================================
# 2. CREATE EMPTY MODEL
# ============================================================

model = models.Sequential(
    name="PlantGuard_CNN"
)


# ============================================================
# 3. INPUT LAYER
# ============================================================

model.add(
    layers.Input(
        shape=(
            IMAGE_HEIGHT,
            IMAGE_WIDTH,
            CHANNELS
        )
    )
)


# ============================================================
# 4. CNN BLOCK 1
# ============================================================

# Convolution Layer
model.add(
    layers.Conv2D(
        filters=32,
        kernel_size=(3, 3),
        padding="same",
        activation="relu",
        name="conv_block_1"
    )
)

# Batch Normalization
model.add(
    layers.BatchNormalization(
        name="batch_norm_1"
    )
)

# Max Pooling
model.add(
    layers.MaxPooling2D(
        pool_size=(2, 2),
        name="max_pool_1"
    )
)


# ============================================================
# 5. CNN BLOCK 2
# ============================================================

model.add(
    layers.Conv2D(
        filters=64,
        kernel_size=(3, 3),
        padding="same",
        activation="relu",
        name="conv_block_2"
    )
)

model.add(
    layers.BatchNormalization(
        name="batch_norm_2"
    )
)

model.add(
    layers.MaxPooling2D(
        pool_size=(2, 2),
        name="max_pool_2"
    )
)


# ============================================================
# 6. CNN BLOCK 3
# ============================================================

model.add(
    layers.Conv2D(
        filters=128,
        kernel_size=(3, 3),
        padding="same",
        activation="relu",
        name="conv_block_3"
    )
)

model.add(
    layers.BatchNormalization(
        name="batch_norm_3"
    )
)

model.add(
    layers.MaxPooling2D(
        pool_size=(2, 2),
        name="max_pool_3"
    )
)


# ============================================================
# 7. CNN BLOCK 4
# ============================================================

model.add(
    layers.Conv2D(
        filters=256,
        kernel_size=(3, 3),
        padding="same",
        activation="relu",
        name="conv_block_4"
    )
)

model.add(
    layers.BatchNormalization(
        name="batch_norm_4"
    )
)

model.add(
    layers.MaxPooling2D(
        pool_size=(2, 2),
        name="max_pool_4"
    )
)


# ============================================================
# 8. FEATURE EXTRACTION
# ============================================================

model.add(
    layers.GlobalAveragePooling2D(
        name="global_average_pooling"
    )
)


# ============================================================
# 9. CLASSIFIER
# ============================================================

model.add(
    layers.Dense(
        256,
        activation="relu",
        name="dense_1"
    )
)


# ============================================================
# 10. DROPOUT
# ============================================================

model.add(
    layers.Dropout(
        0.4,
        name="dropout"
    )
)


# ============================================================
# 11. OUTPUT LAYER
# ============================================================

model.add(
    layers.Dense(
        NUM_CLASSES,
        activation="softmax",
        name="predictions"
    )
)


# ============================================================
# 12. DISPLAY MODEL SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("🌱 PLANTGUARD AI - CNN MODEL ARCHITECTURE")
print("=" * 70)

print(
    f"\nInput Shape: "
    f"({IMAGE_HEIGHT}, {IMAGE_WIDTH}, {CHANNELS})"
)

print(
    f"Number of Classes: {NUM_CLASSES}"
)

print("\n")

model.summary()

print("\n" + "=" * 70)

print("✅ CNN MODEL BUILT SUCCESSFULLY")

print("=" * 70)

# ============================================================
# 13. COMPILE MODEL
# ============================================================

from tensorflow.keras.optimizers import Adam


model.compile(
    optimizer=Adam(
        learning_rate=0.001
    ),
    
    loss="sparse_categorical_crossentropy",
    
    metrics=[
        "accuracy"
    ]
)


print("\n" + "=" * 70)
print("✅ MODEL COMPILED SUCCESSFULLY")
print("=" * 70)

print("\nOptimizer : Adam")
print("Learning Rate : 0.001")
print("Loss : Sparse Categorical Crossentropy")
print("Metric : Accuracy")