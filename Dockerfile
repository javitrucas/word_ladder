# Usamos imagen oficial de Python
FROM python:3.12-slim

# Directorio de trabajo
WORKDIR /app

# Copiamos solo el backend
COPY backend/ /app

# Instalamos dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Exponemos puerto
EXPOSE 8000

# Comando para ejecutar la app
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]
