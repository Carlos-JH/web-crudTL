Crea una aplicación TODO List sencilla. La aplicación debe permitir a los usuarios crear, ver, actualizar y eliminar tareas. 
Utiliza NodeJS y Express para el backend y HTML, CSS y JavaScript para el frontend. Almacena las tareas en un arreglo en memoria.

Comandos:
npm init --yes (inicia node.js y crea nuestro package json)
npm install express (instalamos express)
npm install nodemon -D (Modulo para reiniciar server automáticamente {solo como dependencia de desarrollador "-D"})

Modificamos nuestro package.json:
{
"name": "servertl",
"version": "1.0.0",
"description": "",
"main": "index.js",
"scripts": {
"start": "nodemon app.js"
},
"keywords": [],
"author": "",
"license": "ISC",
"dependencies": {
"express": "^4.19.2"
},
"devDependencies": {
"nodemon": "^3.1.4"
}
}

npm run start (inicia el ser)
Nota: Se comunica por el puerto 8000
