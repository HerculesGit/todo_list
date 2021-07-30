
== MIGRATION

CREATE TABLE 
npx sequelize migration:create --name=create-todo

SEQUELIZE 
# sequelize model:generate --name Task --attributes name:STRING,isDone:BOOLEAN
# npx sequelize db:migrate

