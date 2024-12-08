import pandas as pd
import numpy as np

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