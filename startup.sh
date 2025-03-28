

echo ".env creation"
touch .env

echo "DATABASE NAME :"
read db_name
echo "DATABASE_NAME='$db_name'" >> .env

echo "DATABASE USER :"
read db_user
echo "DATABASE_USER='$db_user'" >> .env

echo "DATABASE PASSWORD :"
read db_pwd
echo "DATABASE_PASSWORD='$db_pwd'" >> .env

echo "DATABASE HOST :"
read db_host
echo "DATABASE_HOST='$db_host'" >> .env

echo ".env file created"

npm run dev