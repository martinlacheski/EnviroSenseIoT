import json

# Cargar el archivo JSON
with open('IoT-Backend.postman_test_run.json', 'r') as file:
    data = json.load(file)

# Configuración
BASE_URL = "http://envirosense.duckdns.org:8000"
OUTPUT_FILE = "resultados_endpoints.txt"

# Mapear IDs a métodos HTTP
method_map = {req['id']: req['method'] for req in data['collection']['requests']}

# Encabezados y separador
header = (
    f"{'MÉTODO'.ljust(8)}"
    f"{'NOMBRE'.ljust(40)}"
    f"{'ENDPOINT'.ljust(35)}"
    f"{'TIEMPO (ms)'.rjust(12)}"
    f"{'RESPUESTA'.rjust(12)}\n"
    + "-" * 107  # Separador visual
)

# Generar contenido
content = []
for result in data['results']:
    method = method_map.get(result['id'], "N/A").ljust(8)
    name = result['name'].ljust(40)
    endpoint = result['url'].replace(BASE_URL, "").ljust(35)
    time = str(result['time']).rjust(12)
    response = f"{result['responseCode']['code']} {result['responseCode']['name']}".rjust(12)
    
    content.append(f"{method}{name}{endpoint}{time}{response}")

# Escribir archivo
with open(OUTPUT_FILE, 'w', encoding='utf-8') as file:
    file.write(header + "\n")
    file.write("\n".join(content))

print(f"✓ Archivo generado: '{OUTPUT_FILE}'")