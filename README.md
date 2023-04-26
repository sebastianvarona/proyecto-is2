# Antes de empezar!

Renombrar el archivo `.env.example` por `.env`

## Importante tener instalado

- Node.js >= a la versión 14
- Uno de los instaladores de paquetes que mencionaré en el paso a continuación

## Instalar todas las dependencias necesarias para correr el proyecto

_Importante correr los comandos a continuación dentro de el directorio raíz del proyecto_
Por medio de [npm](https://www.npmjs.com/):

- `npm install`
  Por medio de [yarn](https://yarnpkg.com/):
- `yarn`

## COMANDOS IMPORTANTES

Luego de que hayan completado todos los pasos anteriores es importante llenar la base de datos con datos de ejemplo para ver más o menos como funcionaría la app. Por lo que ahora vamos a crear la base de datos y a llenarla con datos con los siguientes comandos:

- `npx prisma db push` esto creará el archivo _~/prisma/dev.db_
- `npx prisma db seed` esto llenará la base de datos con datos de ejemplo!
  _Por el momento tenemos 3 usuarios, 1 estudiante y 2 profesores. La cuenta del estudiante es svarona@email.com:svarona, y de uno de los profesores es asolano@edu.co:asolano_

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
