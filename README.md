# Tutorial de Remix!
Proyecto para explorar las opciones de remix como styles, rutas anidadas, rutas dinámicas, renderización y Outlet.

## Instalación de dependencias
Despues de clonar el proyecto se deben instalar las dependencias para ello se utiliza el comando:

```sh
npm install
```
Las dependencias que se instalan son las que están relacionadas en el archivo package.json

## Arrancar el proyecto 
Para iniciar el proyecto en modo develop se utiliza el comando: 

```sh
npm run dev
```

## Links
Para agregar estilos a un proyecto se puede hacer a través de linksFunction, si se desean aplicar a todos los componentes se realizá lo siguiente en el archivo root.tsx

- Importar LinksFuncion y los archivos css que se desean utilizar
```sh
import type { LinksFunction } from "@remix-run/node";
```
```sh
import appStylesHref from "./app.css?url";
```
- Se crea la función links, y se referencian los archivos que se desean linkiar, en este caso el archivo css
```sh
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];
```
- Se agrega la etiqueta Links en el head de la función default App para que se pueda renderizar los estilos
```sh
<Links/>
```
## Rutas anidadas
Para realiza rutas anidadas se utiliza Outlet, lo cual permite que se rendericen las rutas hijas en el layout del padre. En el archivo padre root.tsx se debe:

- Importar Outlet
```sh
import {Outlet} from "@remix-run/react";
```
- Se agrega la etiqueta Outlet en el body de la función default App para que se pueda renderizar los componentes hijos.
```sh
<div>
  <Outlet />
</div>
```
## Rutas dinámicas
Se usa para que un componente tenga rutas diferentes de acuerdo a una variable. Para crear las rutas se tienen las siguientes convenciones:

- . corresponde a un / en la URL
- $ crea la parte dinamica de la dirección, despues de el signo de dolares es la parte variable 

```sh
app/routes/contacts.$contactId.tsx
```
## validación de parámetros con invariant
Para la validación de los parametros se puede usar la función invariant, la cual tiene dos parámetros, una condición y un mensaje, si la condición resulta falsa durante la ejecución del código se muestra el mensaje.
- Importar la función
  
```sh
import invariant from "tiny-invariant";
```
- Declarar la función invariant en la función loader o action

```sh
invariant(params.contactId, "Missing contactId param");
```

## Loader y useLoaderData
Se usa para recuperar datos de una API y renderizar los datos en los componentes.
- Importa la función useLoaderData y LoaderFunctionArgs
  
```sh
import {useLoaderData} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
```
- Exportar la función loader para recuperar los datos del componente data.ts, se llama a la función tipo get getContacts allí definida

```sh
export const loader = async ({params,}: LoaderFunctionArgs) => {
  const contact = await getContact(params.contactId);
  return json({ contact });
};
```
- Al argumento de la función loader se le asigna el tipo LoaderFunctionArgs, el cual es un objeto que tiene como una de sus propiedades params (parametros de la ruta)
- Los datos obtenidos se guardan en un json para luego ser recuperados y renderizados con el hook useLoaderData. Este hook permite acceder a la información cargada por el loader.

```sh
const { contacts } = useLoaderData<typeof loader>();
```
## Action
Se usa para recuperar la información que se ingresa en la vizualización de un componente.(Por ejemplo en un formulario)

- Importa ActionFunctionArgs
  
```sh
import type { ActionFunctionArgs } from "@remix-run/node";
```
- Exportar la función Action para capturar los datos ingresados por el usuario y en este ejemplo actualizar la información del contacto.

```sh
export const action = async ({params,request,}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
  };
```
- A los argumentos de la función Action se le asigna el tipo ActionFunctionArgs, y a diferencia de loader no solo se le envía params sino tambien request que hace referencia al tipo de solicitud HTTP que se va a realizar.
- Con el método formData se recupera la infromación digitada en el formulario y luego se almacena en un objeto con los datos organizados en clave-valor.
- Finalmente se hace el llamado a la función updateContact y se envía los datos para su actualización. 
