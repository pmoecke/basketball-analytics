FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \        
    && rm -rf /var/lib/apt/lists/*

COPY ./ /srv/backend-app
WORKDIR /srv/backend-app
RUN pip3 install --no-cache-dir .

CMD [ "start-server", "--host", "0.0.0.0"]