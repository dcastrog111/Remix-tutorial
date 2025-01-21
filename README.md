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
## Loader
Se usa para recuperar y cargar datos en los componentes. En el archivo root.tsx se debe:
- Importa la función useLoaderData
  
```sh
import {useLoaderData} from "@remix-run/react";
```
- Crear la función loader para recuperar los datos del componente data.ts, se llama a la función tipo get getContacts allí definida

```sh
export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};
```
- En la función default App se crea un array para almacenar toda la data recuperada.

```sh
const { contacts } = useLoaderData<typeof loader>();
```
- En el body (navbar) se usa este array para listar cada uno de sus elementos y se utiliza la etiqueta Link para configurar la URL dinámica, con el id de cada componente del array se crea la parte dinamica de la ruta

```sh
{contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
)
```
- Para que la data que se renderice al hacer clic en cada elemento de la lista sea dinámica, se debe en el componente contacts.$contactId.tsx importar la función useLoaderData y crear una función loader con parámetro. Este  params.contactId que se envía a la función get corresponde a la parte dinámica de la URL, la función getContact recupera de data el objeto que coincide con el id. 

```sh
export const loader = async ({ params }) => {
  const contact = await getContact(params.contactId);
  return json({ contact });
};
```
