This project is created by - Magnus Stampe | Rasmus Mogensen | Elias Lip Marco | Emil Emerek

This README is created as an installation guide for our project Safestay

## Installation - Postgres and PgAdmin

To run our project you need to install [Postgres](https://www.postgresql.org/download/) and [PgAdmin](https://www.pgadmin.org/download/).

```bash
CLick on the link Postgres, choose you system, click 'download the installer' and choose version 12 and follow the install guide. (You might have to click on 'start the download now')

When installing Postgres, accept all the question but uncheck the pgadmin. You need to install that seperatly.

After installing Postgres on you system, click on the PgAdmin link and choose your system under version 4.

Download version 4.21 or later.

You will need to make a password your postgresql server, and save it for later setup.
```

## Installation - Database

To setup the database, you will need to run som differernt sql qeuries in the PgAdmin tool.

```bash
Open PgAdmin and unwrap 'Servers' then 'PostgreSQL 12' and then right-click on databases and choose CREATE DATABASE.

Name the database and save it for later setup. The open the query tool and run the following queries.
    - Database.sql
    - Audit.sql
    - InsertUser.sql
    - InsertPropertyOwner.sql
    - InsertProperty.sql
    - InsertRentdeal.sql

```
Database setup done!

## Installation - Node.js and React

For the installation of the project:

```bash
Clone our git repo and run npm install in both our 'client' and 'server' directory.

Now enter our /server/config folder and make a copy of 'dbCredentialsTemplate' inside config
and rename it to 'dbcredentials'.

Here we need to enter some information

    - database = The name you gave your database in postgres
    - port = '5432'
    - host = 'localhost'
    - user = 'postgres'
    - password = The password for your postgres server

```
Connection done!


## Run Project

Now we have a database and a connection from the backend, and now we just need to run the project.

```bash
In your terminal, cd to the server folder and run 'nodemon server'.
In another terminal cd to client and run 'npm run start'.
```

Enjoy! :)