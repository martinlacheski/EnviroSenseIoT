import csv
from collections import defaultdict

def calcular_promedios_desde_csv(archivo_csv):
    # Inicializar variables
    total_tiempo = 0
    conteo_total = 0
    tiempos_por_metodo = defaultdict(lambda: {'suma': 0, 'conteo': 0})
    
    # Leer archivo CSV
    with open(archivo_csv, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for fila in reader:
            try:
                tiempo = int(fila['TIEMPO (ms)'])
                metodo = fila['MÉTODO']
                
                # Acumular totales
                total_tiempo += tiempo
                conteo_total += 1
                
                # Acumular por método
                tiempos_por_metodo[metodo]['suma'] += tiempo
                tiempos_por_metodo[metodo]['conteo'] += 1
                
            except (ValueError, KeyError):
                continue
    
    # Calcular promedios
    promedio_general = round(total_tiempo / conteo_total, 2) if conteo_total > 0 else 0
    
    promedios_por_metodo = {}
    for metodo, datos in tiempos_por_metodo.items():
        if datos['conteo'] > 0:
            promedios_por_metodo[metodo] = round(datos['suma'] / datos['conteo'], 2)
    
    return {
        'promedio_general': promedio_general,
        'promedios_por_metodo': promedios_por_metodo,
        'conteos_por_metodo': {metodo: datos['conteo'] for metodo, datos in tiempos_por_metodo.items()}
    }

def generar_reporte(resultados, archivo_salida='promedios_tiempos.txt'):
    with open(archivo_salida, 'w', encoding='utf-8') as file:
        file.write("REPORTE DE TIEMPOS DE RESPUESTA\n")
        file.write("="*40 + "\n\n")
        
        file.write(f"Promedio general: {resultados['promedio_general']} ms\n")
        file.write(f"Total de solicitudes: {sum(resultados['conteos_por_metodo'].values())}\n\n")
        
        file.write("Promedios por método HTTP:\n")
        file.write("-"*40 + "\n")
        for metodo, promedio in sorted(resultados['promedios_por_metodo'].items()):
            conteo = resultados['conteos_por_metodo'][metodo]
            file.write(f"{metodo.ljust(6)}: {str(promedio).rjust(7)} ms ({conteo} solicitudes)\n")

# Ejecución principal
if __name__ == "__main__":
    ARCHIVO_CSV = "resultados_endpoints.csv"
    ARCHIVO_REPORTE = "reporte_promedios.txt"
    
    try:
        print(f"Procesando archivo {ARCHIVO_CSV}...")
        resultados = calcular_promedios_desde_csv(ARCHIVO_CSV)
        
        generar_reporte(resultados, ARCHIVO_REPORTE)
        print(f"✓ Reporte generado: '{ARCHIVO_REPORTE}'")
        
        # Mostrar resumen en consola
        print("\nResumen de promedios:")
        print(f"- General: {resultados['promedio_general']} ms")
        for metodo, promedio in resultados['promedios_por_metodo'].items():
            print(f"- {metodo}: {promedio} ms")
            
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {ARCHIVO_CSV}")
    except Exception as e:
        print(f"Error inesperado: {str(e)}")