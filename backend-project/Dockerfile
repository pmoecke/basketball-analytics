FROM python:3.12-slim

COPY ./ /srv/backend-app

WORKDIR /srv/backend-app
RUN pip3 install --no-cache-dir .

CMD [ "start-server", "--host", "0.0.0.0"]