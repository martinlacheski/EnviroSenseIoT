# Usar imagen base Python Alpine
FROM python:3.13-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apk update && apk add --no-cache \
    gcc \
    musl-dev \
    python3-dev

# Copiar archivo requirements.txt
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar la aplicación
COPY . .

# Configurar PYTHONPATH
ENV PYTHONPATH=/app

# Puerto expuesto
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]