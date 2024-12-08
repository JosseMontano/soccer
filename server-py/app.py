import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
import numpy as np
import pandas as pd

# Carga y preprocesa tus datos
data = pd.read_csv('historical_matches.csv')  # Dataset de partidos históricos
X = data[['home_goals', 'away_goals']]   # Variables de entrada (estadísticas)
y = data['result']  # Etiqueta (0 = derrota equipo 1, 1 = empate, 2 = victoria equipo 1)

# Dividir los datos en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Crear un modelo de red neuronal
model = Sequential([
    Dense(64, activation='relu', input_shape=(2,)),
    Dense(32, activation='relu'),
    Dense(3, activation='softmax')  # Tres salidas: derrota, empate, victoria
])

# Compilar el modelo
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Entrenar el modelo
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.2)

# Evaluar el modelo
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Accuracy: {accuracy:.2f}")


new_match_data = np.array([[10, 10]]) # Ejemplo de datos del próximo partido
prediction = model.predict(new_match_data)
print(f"Probabilidades: Derrota: {prediction[0][0]:.2f}, Empate: {prediction[0][1]:.2f}, Victoria: {prediction[0][2]:.2f}")
