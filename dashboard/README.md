CI Dashboard
=============

CI Dashboard backend ins develop in Python Django. It serve as a backend for UI.
It uses Django Rest framework to deal with API.

Running
=======
```
  git clone https://github.com/amolkahat/ci_dashboard.git
  cd ci_dashboard/dashboard/
  virtualenv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
```

It uses Redis to cache the data, so use will get fast response. And postgres sql as db.

```
podman run -d --name postgres -e POSTGRES_PASSWORD=SECret.123 -e PGDATA=/var/lib/postgresql/data/pgdata -v ./data:/var/lib/postresql/data -p 5432:5432 postgres

podman run -d --name rediscontainer  -p 6739:6739 redis
```

To start backend server

```
./manage.py runserver

``
This will serve on localhost:8000/.


## NPM

To run dahboard ui is developed using npm and ReactJS.
In other terminal run the following commands

```
  cd ci_dashboard/ui
  npm i
  npm start
```

It will serve on localhost:3000/.