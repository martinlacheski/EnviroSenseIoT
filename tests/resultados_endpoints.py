import json
import csv

# Cargar el archivo JSON
with open('IoT-Backend.postman_test_run.json', 'r') as file:
    data = json.load(file)

# Configuración
BASE_URL = "http://envirosense.duckdns.org:8000"
OUTPUT_FILE = "resultados_endpoints.csv"

# Mapear IDs a métodos HTTP
method_map = {req['id']: req['method'] for req in data['collection']['requests']}

# Generar datos para CSV
csv_data = []
headers = ['MÉTODO', 'NOMBRE', 'ENDPOINT', 'TIEMPO (ms)', 'RESPUESTA']

for result in data['results']:
    method = method_map.get(result['id'], "N/A")
    name = result['name']
    endpoint = result['url'].replace(BASE_URL, "")
    time = result['time']
    response = f"{result['responseCode']['code']} {result['responseCode']['name']}"
    
    csv_data.append([method, name, endpoint, time, response])

# Escribir archivo CSV
with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(headers)  # Escribir encabezados
    writer.writerows(csv_data)  # Escribir datos

print(f"✓ Archivo CSV generado: '{OUTPUT_FILE}'")