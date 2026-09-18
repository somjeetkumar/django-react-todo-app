# Todo App

A full-stack Todo application built with **Django REST Framework**, **React**, **MySQL**, and **Redis**, containerized with **Docker Compose**.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Django + Django REST Framework
- **Database:** MySQL 8.0
- **Cache:** Redis 7
- **Containerization:** Docker + Docker Compose

## Project Structure

```text
todo/
├── client/                 # React frontend
├── drf-react-todolist/     # Django REST API
│   ├── manage.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── drf_react/
│   └── tasks/
└── docker-compose.yml
```

## Features

- Todo management through a Django REST API
- React frontend
- MySQL database
- Redis caching
- Dockerized frontend, backend, MySQL, and Redis

## Run the Project

Make sure Docker Desktop is running, then open a terminal in the folder containing `docker-compose.yml`.

### 1. Build and start the project

```bash
docker compose up -d --build
```

### 2. Check running containers

```bash
docker compose ps
```

You should see the frontend, backend, MySQL, and Redis services running.

### 3. Check logs if needed

```bash
docker compose logs -f
```

### 4. Create a Django superuser (optional)

```bash
docker compose exec backend python manage.py createsuperuser
```

### 5. Stop the project

```bash
docker compose stop
```

### 6. Start the project again

```bash
docker compose start
```

### 7. Stop and remove containers

```bash
docker compose down
```

> `docker compose down` does not remove the `mysql_data` volume, so the MySQL data is preserved.

## Application Ports

| Service | Port |
|---|---:|
| React frontend | `5173` |
| Django backend | `8000` |
| MySQL | `3306` |
| Redis | `6379` |

## Environment / Docker Notes

Inside Docker Compose, Django connects to:

- MySQL: `mysql:3306`
- Redis: `redis:6379`

The MySQL data is stored in the Docker volume `mysql_data`, so recreating the containers does not normally remove the database data.

## Development

After changing backend or frontend code, rebuild the changed service:

```bash
docker compose up -d --build backend
```

or:

```bash
docker compose up -d --build frontend
```

If both services were changed:

```bash
docker compose up -d --build
```

## Author

**Somjeet**
