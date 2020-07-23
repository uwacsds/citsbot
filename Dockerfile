FROM python:3.8-slim as base
ENV TZ=Australia/Perth
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "./src/main.py"]

FROM base as prod
CMD ["python", "./src/main.py"]

FROM base as dev
RUN apt-get update && \
    apt-get install -y nodejs npm gcc  && \ 
    npm install -g nodemon
RUN pip install ptvsd
RUN pip install --no-cache-dir -r requirements.txt
CMD ["nodemon", "--exec", "python", "-m", "ptvsd", "--host", "0.0.0.0", "-port", "5678", "./src/main.py"]
