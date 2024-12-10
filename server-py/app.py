from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel 
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split

# Create FastAPI instance
app = FastAPI()

# Configure CORS
origins = ["http://localhost:5173", "http://localhost:8000","exp://192.168.1.13:19000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    amountVictoriesTeam1: int
    amountVictoriesTeam2: float

@app.get('/')
def index():
    return {"Choo Choo": "Welcome to the API soccer 🚅"}


@app.get('/api/dataset')
async def seed():
    try:
        # Generar datos ficticios
        np.random.seed(42)
        # Supongamos que tenemos 1000 partidos
        n_matches = 1000
        # Crear columnas de estadísticas para los partidos
        home_goals = np.random.randint(0, 6, size=n_matches)  # Goles del equipo local
        away_goals = np.random.randint(0, 6, size=n_matches)  # Goles del equipo visitante
        # Etiqueta 'result' (0 = derrota equipo 1, 1 = empate, 2 = victoria equipo 1)
        results = np.where(home_goals > away_goals, 2, np.where(home_goals < away_goals, 0, 1))
        # Crear un DataFrame
        data = pd.DataFrame({
            'home_goals': home_goals,
            'away_goals': away_goals,
            'result': results  # 0 = derrota, 1 = empate, 2 = victoria
        })
        # Guardar el DataFrame como CSV
        data.to_csv('historical_matches.csv', index=False)

        print(data.head())
        return {"status": 200, "message": "Partidos exitosos"}
    except Exception as e:
        return {"status": 500, "message": str(e)}


@app.post('/api/prediction')
def preditcion(request: PredictionRequest):
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

    # Predicción para un partido nuevo
    new_match_data = np.array([[request.amountVictoriesTeam1, request.amountVictoriesTeam2]])  # Ejemplo de datos del próximo partido
    prediction = model.predict(new_match_data)[0]

    # Calcular las probabilidades con descripciones claras
    prob_defeat = prediction[0] * 100  # Probabilidad de derrota
    prob_draw = prediction[1] * 100    # Probabilidad de empate
    prob_victory = prediction[2] * 100 # Probabilidad de victoria

    # Crear un mensaje claro
    result_message = (
        f"La probabilidad de que el equipo pierda es del {prob_defeat:.2f}%, "
        f"de que haya empate es del {prob_draw:.2f}%, "
        f"y de que el equipo gane es del {prob_victory:.2f}%."
    )

    return {"message": result_message, "status": 200, "data":result_message}

# Run the application
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=5000, debug=True)