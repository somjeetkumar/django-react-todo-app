# Todo App — Django REST Framework + React + MySQL + Redis + Docker

## Project Stack

- **Backend:** Django 5.1.3 + Django REST Framework
- **Frontend:** React + Vite
- **Database:** MySQL 8.0
- **Cache:** Redis 7
- **Containerization:** Docker + Docker Compose
- **Deployment target:** Ubuntu / AWS EC2
- **Reverse proxy:** Nginx

---

# 1. Project Structure

```text
todo/
├── client/                 # React frontend
│   └── dockerfile
│
├── drf-react-todolist/     # Django backend
│   ├── manage.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── drf_react/
│   └── tasks/
│
└── docker-compose.yml
```

> Run Docker Compose commands from the directory containing `docker-compose.yml`.

---

# 2. Run Locally with Docker

## Build and start everything

```bash
docker compose up -d --build
```

## Check containers

```bash
docker compose ps
```

Expected services:

```text
backend
frontend
mysql
redis
```

## View all logs

```bash
docker compose logs
```

## Follow all logs

```bash
docker compose logs -f
```

## Backend logs

```bash
docker compose logs -f backend
```

## Frontend logs

```bash
docker compose logs -f frontend
```

## MySQL logs

```bash
docker compose logs -f mysql
```

## Redis logs

```bash
docker compose logs -f redis
```

---

# 3. Docker Compose Commands

## Start existing containers

```bash
docker compose start
```

## Stop containers

```bash
docker compose stop
```

## Restart containers

```bash
docker compose restart
```

## Stop and remove containers/network

```bash
docker compose down
```

## Stop and remove containers + volumes

```bash
docker compose down -v
```

> ⚠️ `-v` removes Compose-managed volumes. Your MySQL data is stored in the `mysql_data` volume, so don't use this unless you intentionally want to remove the database data.

## Validate Compose file

```bash
docker compose config
```

## Build only backend

```bash
docker compose build backend
```

## Build only frontend

```bash
docker compose build frontend
```

## Rebuild backend without cache

```bash
docker compose build --no-cache backend
```

## Rebuild and start backend

```bash
docker compose up -d --build backend
```

---

# 4. Django Commands

The backend container is named `django-backend`.

## Run migrations

```bash
docker compose exec backend python manage.py migrate
```

The current Dockerfile also runs migrations when the backend container starts:

```dockerfile
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
```

## Check Django

```bash
docker compose exec backend python manage.py check
```

## Create migrations

```bash
docker compose exec backend python manage.py makemigrations
```

## Apply migrations

```bash
docker compose exec backend python manage.py migrate
```

## Create superuser

```bash
docker compose exec backend python manage.py createsuperuser
```

## Open Django shell

```bash
docker compose exec backend python manage.py shell
```

## Open shell inside backend container

```bash
docker compose exec backend sh
```

## Collect static files

```bash
docker compose exec backend python manage.py collectstatic --noinput
```

---

# 5. MySQL Commands

The MySQL Compose service is named:

```text
mysql
```

Django connects to it using:

```text
HOST=mysql
PORT=3306
```

## Open MySQL CLI

```bash
docker compose exec mysql mysql -u django_user -p
```

Password:

```text
django_password
```

## Check MySQL container

```bash
docker compose ps mysql
```

## MySQL logs

```bash
docker compose logs -f mysql
```

## Database settings used by this project

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "todo_db",
        "USER": "django_user",
        "PASSWORD": "django_password",
        "HOST": "mysql",
        "PORT": "3306",
    }
}
```

### Docker networking rule

Inside Docker Compose:

```text
Django container
      |
      | mysql:3306
      v
MySQL container
```

Do **not** use `localhost` for the Django-to-MySQL connection when Django and MySQL are separate containers.

---

# 6. Redis Commands

The Redis Compose service is named:

```text
redis
```

Django uses:

```text
redis://redis:6379/1
```

## Test Redis

```bash
docker compose exec redis redis-cli ping
```

Expected:

```text
PONG
```

## Open Redis CLI

```bash
docker compose exec redis redis-cli
```

## Show Redis information

```redis
INFO
```

## Show keys

```redis
KEYS *
```

## Get a key

```redis
GET key_name
```

## Delete a key

```redis
DEL key_name
```

---

# 7. Test Django Cache

Open the Django shell:

```bash
docker compose exec backend python manage.py shell
```

Then:

```python
from django.core.cache import cache

cache.set("test", "hello", 60)
cache.get("test")
```

Expected:

```text
'hello'
```

---

# 8. Docker Container Commands

## List running containers

```bash
docker ps
```

## List all containers

```bash
docker ps -a
```

## View container logs

```bash
docker logs django-backend
```

## Follow logs

```bash
docker logs -f django-backend
```

## Open a shell

```bash
docker exec -it django-backend sh
```

## Inspect container

```bash
docker inspect django-backend
```

## List images

```bash
docker images
```

## List volumes

```bash
docker volume ls
```

## Inspect volume

```bash
docker volume inspect todo_mysql_data
```

## List Docker networks

```bash
docker network ls
```

## Inspect Compose network

```bash
docker network inspect todo_default
```

> The exact generated network name can differ depending on the Compose project name. Use `docker network ls` to find it.

---

# 9. Docker Disk Usage

## Check Docker disk usage

```bash
docker system df
```

## More detailed disk usage

```bash
docker system df -v
```

## Remove unused resources

```bash
docker system prune
```

> ⚠️ Review what Docker proposes to remove before confirming.

---

# 10. Important Dockerfile Concepts Used in This Project

Backend:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
```

The `apt-get` packages are required because `mysqlclient` needs system libraries/build tools when it is installed in the slim Python image.

Frontend:

```dockerfile
FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

---

# 11. Ubuntu Basic Commands

## Update package list

```bash
sudo apt update
```

## Upgrade packages

```bash
sudo apt upgrade -y
```

## Install package

```bash
sudo apt install <package-name> -y
```

## Remove package

```bash
sudo apt remove <package-name>
```

## Current directory

```bash
pwd
```

## List files

```bash
ls
```

## List hidden files

```bash
ls -la
```

## Change directory

```bash
cd <directory>
```

## Go back

```bash
cd ..
```

## Go to home

```bash
cd ~
```

## Create directory

```bash
mkdir <directory>
```

## Create file

```bash
touch <filename>
```

## Copy

```bash
cp source destination
```

## Move/rename

```bash
mv source destination
```

## Remove file

```bash
rm <file>
```

## Remove directory

```bash
rm -r <directory>
```

> ⚠️ Be careful with `rm`.

## Edit file

```bash
nano <filename>
```

---

# 12. Ubuntu Service Commands

## Check service

```bash
sudo systemctl status <service>
```

## Start service

```bash
sudo systemctl start <service>
```

## Stop service

```bash
sudo systemctl stop <service>
```

## Restart service

```bash
sudo systemctl restart <service>
```

## Enable service at boot

```bash
sudo systemctl enable <service>
```

## Disable service at boot

```bash
sudo systemctl disable <service>
```

---

# 13. Ubuntu System / Disk Commands

## Check disk space

```bash
df -h
```

## Check folder size

```bash
du -sh <folder>
```

## Check current directory sizes

```bash
du -sh ./*
```

## Check memory

```bash
free -h
```

## Check CPU/processes

```bash
top
```

## Check ports

```bash
sudo ss -tulpn
```

---

# 14. Git Commands for Deployment

## Clone repository

```bash
git clone <repository-url>
```

## Enter project

```bash
cd todo
```

## Check status

```bash
git status
```

## Pull latest code

```bash
git pull
```

## Show branches

```bash
git branch
```

## Create and switch branch

```bash
git checkout -b feature-name
```

## Stage changes

```bash
git add .
```

## Commit

```bash
git commit -m "your message"
```

## Push

```bash
git push origin <branch-name>
```

---

# 15. AWS EC2 — Connect to Ubuntu

From Windows PowerShell/CMD:

```bash
ssh -i "your-key.pem" ubuntu@<EC2-PUBLIC-IP>
```

Example:

```bash
ssh -i "todo-server.pem" ubuntu@12.34.56.78
```

After login:

```bash
sudo apt update
```

---

# 16. EC2 Initial Setup

```bash
sudo apt update
sudo apt upgrade -y
```

Install Git:

```bash
sudo apt install git -y
```

Check:

```bash
git --version
```

Clone project:

```bash
git clone <repository-url>
```

Enter project:

```bash
cd todo
```

---

# 17. Install Docker on Ubuntu

Install Docker using the official Docker instructions for your Ubuntu version.

Verify:

```bash
docker --version
```

```bash
docker compose version
```

Check Docker service:

```bash
sudo systemctl status docker
```

Start Docker:

```bash
sudo systemctl start docker
```

Enable Docker at boot:

```bash
sudo systemctl enable docker
```

### Optional: run Docker without sudo

```bash
sudo usermod -aG docker $USER
```

Log out and log back in, then:

```bash
docker ps
```

---

# 18. Deploy This Project on EC2

From the project directory:

```bash
git clone <repository-url>
cd todo
```

Build and start:

```bash
docker compose up -d --build
```

Check:

```bash
docker compose ps
```

Check logs:

```bash
docker compose logs -f
```

Backend logs:

```bash
docker compose logs -f backend
```

If the backend starts correctly, migrations run automatically from the Dockerfile command.

---

# 19. Updating the EC2 Deployment

After pushing new code to Git:

```bash
git pull
```

Then rebuild only the changed service when appropriate.

Backend changed:

```bash
docker compose up -d --build backend
```

Frontend changed:

```bash
docker compose up -d --build frontend
```

Both changed:

```bash
docker compose up -d --build
```

Check:

```bash
docker compose ps
```

Check logs:

```bash
docker compose logs -f backend
```

---

# 20. Nginx on Ubuntu

## Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

## Check status

```bash
sudo systemctl status nginx
```

## Start

```bash
sudo systemctl start nginx
```

## Restart

```bash
sudo systemctl restart nginx
```

## Test configuration

```bash
sudo nginx -t
```

## Reload configuration

```bash
sudo systemctl reload nginx
```

## Enable at boot

```bash
sudo systemctl enable nginx
```

Important locations:

```text
/etc/nginx/nginx.conf
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
/var/www/html/
```

---

# 21. Example Nginx Reverse Proxy

Example:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

After changing Nginx:

```bash
sudo nginx -t
```

Then:

```bash
sudo systemctl reload nginx
```

---

# 22. Recommended EC2 Architecture

```text
                 Internet
                    |
                    v
             AWS Security Group
                    |
                    v
              Nginx :80/:443
                    |
                    v
          Docker / Django :8000
              /           \
             /             \
            v               v
       MySQL :3306       Redis :6379
       (internal)         (internal)
```

For a basic deployment, MySQL and Redis should communicate with Django through the Docker network instead of being exposed publicly.

---

# 23. AWS Security Group Ports

Typical web deployment:

```text
22   SSH
80   HTTP
443  HTTPS
```

During direct Django testing, you may temporarily allow:

```text
8000
```

Avoid publicly exposing:

```text
3306   MySQL
6379   Redis
```

unless there is a specific requirement and appropriate network/security controls.

---

# 24. Common Troubleshooting

## Compose configuration error

```bash
docker compose config
```

## Container not running

```bash
docker compose ps
```

## Backend error

```bash
docker compose logs -f backend
```

## MySQL error

```bash
docker compose logs -f mysql
```

## Redis error

```bash
docker compose logs -f redis
```

## Check MySQL connection from backend

```bash
docker compose exec backend python manage.py check
```

## Enter backend container

```bash
docker compose exec backend sh
```

## Check Docker service on Ubuntu

```bash
sudo systemctl status docker
```

## Check Nginx configuration

```bash
sudo nginx -t
```

## Check listening ports

```bash
sudo ss -tulpn
```

---

# 25. Important Data Safety Rules

### Do not casually run:

```bash
docker compose down -v
```

because it can remove database volumes.

### Do not manually delete Docker Desktop data from:

```text
C:\Users\<username>\AppData\Local\Docker
```

### MySQL data

This project uses:

```yaml
volumes:
  mysql_data:
```

mounted at:

```text
/var/lib/mysql
```

Therefore, removing the MySQL volume can remove the stored database data.

---

# 26. Quick Command Cheat Sheet

```bash
# Start project
docker compose up -d --build

# Check services
docker compose ps

# Logs
docker compose logs -f

# Backend logs
docker compose logs -f backend

# Stop
docker compose stop

# Start
docker compose start

# Restart
docker compose restart

# Remove containers/network
docker compose down

# Backend rebuild
docker compose up -d --build backend

# Frontend rebuild
docker compose up -d --build frontend

# Django check
docker compose exec backend python manage.py check

# Django migrations
docker compose exec backend python manage.py migrate

# Create superuser
docker compose exec backend python manage.py createsuperuser

# Backend shell
docker compose exec backend sh

# MySQL
docker compose exec mysql mysql -u django_user -p

# Redis test
docker compose exec redis redis-cli ping

# Docker disk usage
docker system df

# Git update
git pull

# EC2 deployment
docker compose up -d --build

# Ubuntu update
sudo apt update
sudo apt upgrade -y

# Docker status
sudo systemctl status docker

# Nginx test
sudo nginx -t

# Nginx reload
sudo systemctl reload nginx
```

---

# 27. Typical Deployment Workflow

```text
Local development
       |
       v
git add .
       |
       v
git commit
       |
       v
git push
       |
       v
EC2
       |
       v
git pull
       |
       v
docker compose up -d --build
       |
       v
Django migrations
       |
       v
Django + React + MySQL + Redis
       |
       v
Nginx
       |
       v
Internet
```
