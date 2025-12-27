# Use a Python base image
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set working directory
WORKDIR /app

# Copy Backend and install requirements
COPY backend/ /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy Frontend and build it
COPY frontend/ /app/frontend/
WORKDIR /app/frontend
RUN npm install
RUN npm run build
# Move the static build to backend/static
RUN mkdir -p /app/backend/static && cp -r out/* /app/backend/static/

# Final setup
WORKDIR /app
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# HF uses port 7860
EXPOSE 7860

# CMD to start the script
CMD ["/app/start.sh"]
