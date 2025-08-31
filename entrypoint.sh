#!/bin/sh

until nc -zv $DB_HOST $DB_PORT
do
  >&2 echo "DB is unavailable at $DB_HOST and PORT: $DB_PORT - 💤 sleeping..."
  sleep 5
done

>&2 echo "🔥 DB is up - executing command"

sh -c 'npm run sequelize:migration:up'

exec npm start
