## AGENTS


Proyecto:

Calculadora de daño pokemon usando el paquete de smogon/calc con npm i @smogon/calc, la idea es hacer una calculadora que tenga dos "cards" para seleccionar un pokemon dentro de cada una y que alli dentro esté toda la info necesaria para el usuario,



Rol del agente:

Desarrollador web experto con 12 años de experiencia.


Objetivo:

crear una aplicación web de calculo de daño para combates pokemon, centrado en la modalidad de pokemon champions.


Funcionalidades de la aplicación:

- Seleccionar o buscar un pokemon por su nombre.
- Dejar espacio para la imagen en la card que implementaremos en pasos futuros.
- Mostrar tipos con colores correspondientes.
- Mostrar estadísticas de combate de cada pokémon (puntos de salud PS, ataque, defensa, ataque especial, defensa especial y velocidad) con barras visuales además de la cantidad en numero.
- Card Izquierda (Atacante): Debe incluir selectores para: Especie, Objeto, Habilidad, Naturaleza, EVs e IVs.

- Panel Central (Resultados): Una sección que muestre el porcentaje de daño, el texto descriptivo de Smogon (ej: 'guaranteed 2HKO') y un botón para 'Invertir' (swapping) atacante y defensor.

- Card Derecha (Defensor): Espejo de la izquierda.
- las estadisticas pueden ser modificadas con un input de tipo range para añadirles los EVS
- Manejo de errores de red pokémon no encontrado.
- Indicadores de carga (spinner)
- funcionalidad de modo oscuro y modo claro.

 Especificaciones de smogon/calc: The @smogon/calc package powers the UI, providing a programmatic interface for computing damage ranges. This subpackage contains code that will run on both the server or browser and can be used as a building block for alternative UIs or applications.

Installation
$ npm install @smogon/calc
Alternatively, as detailed below, if you are using @smogon/calc in the browser and want a convenient way to get started, simply depend on a transpiled and minified version via unpkg:

<script src="https://unpkg.com/@smogon/calc/dist/data/production.min.js"></script>
<script src="https://unpkg.com/@smogon/calc"></script>
In this example, the @smogon/calc/data code is included as well to fulfill the calc's data layer requirement. Alternatively, a more fully-featured data layer such as @pkmn/data may be used instead, see below.

Usage
@smogon/calc exports all of the data types required to perform a calculation. The calculate methods require:

a Generation that contains information about which damage formula mechanics to apply and where all of the data about the generation can be found.
attacker and defender Pokemon (note: only relevant attributes are required, everything else should have sensible defaults). The Pokemon constructor also requires a Generation to provide the Pokémon's data for the generation.
the Move being used by the attacker (which also requires a Generation argument to scope the move data to the particular generation).
(optionally) a Field object containing information about the state of each Side.
calculate returns a Result object that contains methods for fetching damage rolls, ranges, descriptions, recoil/drain information, etc.

import {calculate, Generations, Pokemon, Move} from '@smogon/calc';

const gen = Generations.get(5); // alternatively: const gen = 5;
const result = calculate(
  gen,
  new Pokemon(gen, 'Gengar', {
    item: 'Choice Specs',
    nature: 'Timid',
    evs: {spa: 252},
    boosts: {spa: 1},
  }),
  new Pokemon(gen, 'Chansey', {
    item: 'Eviolite',
    nature: 'Calm',
    evs: {hp: 252, spd: 252},
  }),
  new Move(gen, 'Focus Blast')
);
@smogon/calc comes packaged with all of the data required for damage calculation - by default, it exposes this via its Generations object from @smogon/calc/data. As a shortcut, the Generation argument required by calculate, Pokemon, Move can instead simply be the generation number (eg. 5), and it will handle getting that generations Generation object behind the scenes from the data layer it ships with.

The data in calc/data must be kept in sync with Pokémon Showdown. If there is an issue with the calc's data, please fix it in the simulator first. In general, you should probably not be making manual edits to any of the data files, and in the future, they are likely to be generated programmatically.

In some advanced use cases, you may wish to use a different data layer with the calculator. The @smogon/calc/adaptable entry point can be used with any data layer that implements the calc's Generations interface. This interface is a subset of @pkmn/data's Generations interface, so @pkmn/data (which contains all competitively relevant data from Pokémon Showdown) can be used with the adaptable entry point for applications which want to avoid having two separate sets of the same data shipped to users.

import {Dex} from '@pkmn/dex';
import {Generations} from '@pkmn/data';
import {calculate, Pokemon, Move, Field} from '@smogon/calc/adaptable';

const gens = new Generations(Dex);

const gen = gens.get(1);
const result = calculate(
  gen,
  new Pokemon(gen, 'Gengar'),
  new Pokemon(gen, 'Vulpix'),
  new Move(gen, 'Surf'),
  new Field({defenderSide: {isLightScreen: true}})
);
Browser
The recommended way of using @smogon/calc in a web browser is to configure your bundler (Webpack, Rollup, Parcel, etc) to minimize it and package it with the rest of your application. If you do not use a bundler, a convenience production.min.js is included in the package. You simply need to depend on ./node_modules/@smogon/calc/production.min.js in a script tag (which is what the unpkg shortcut above is doing), after which calc will be accessible as a global. You must also have a Generations implementation provided, you can either depend on the calculator's data layer by depending on ./node_modules/@smogon/calc/data/production.min.js (or @smogon/calc/data via unpkg), or you can use an alternative data layer such as @pkmn/data. You must load your data layer before loading the calc:

<script src="./node_modules/@smogon/calc/data/production.min.js"></script>
<script src="./node_modules/@smogon/calc/production.min.js"></script>
UI
The UI layer is currently is written in vanilla JavaScript and HTML. To view the UI locally you first must install dependencies by running npm install at the top level and without calc/. This should create a node_modules/ folder under both the root directory and under calc/:

$ npm install
$ cd calc && npm install
Next, run node build from the root directory of your clone of this repository. This should run npm run compile in the calc/ subdirectory to compile the @smogon/calc package from TypeScript to JavaScript that can be run in the browser, and then compile the 'templated' HTML and copy everything into the top-level dist/ folder. To then view the UI, open dist/index.html - simply double-clicking on the file from your operating system's file manager UI should open it in your default browser.

$ node build
$ open dist/index.html # open works on macOS, simply double-clicking the file on Windows/macOS works
If you make changes to anything in calc/, you must run node build from the top level to compile the files and copy them into dist/ again. If you make changes to the HTML or JavaScript in src/you must run node build view before the changes will become visible in your browser (node build also works, but it is slower, as it will compile calc/ as well, which is unnecessary if you did not make any changes to that directory).

Before opening up a Pull Request, please ensure npm test passes:

$ npm test
Import
This repository also houses an internal package under import/ which is used for populating the Pokémon sets data (as well as data about random battle options) used by the UI. Before making changes here you must run npm install from under the import/ directory to install its dependencies as they are not installed by default. TASKS.md contains more information on how to programmatically update sets.



Stack de tecnologia:

- HTML5
- CSS3 (nativo)
- Typescript 
- React (en un futuro para más funcionalidades me gustaria usar React Router, dime si es mejor aplicarlo desde ya o si es mejor hacerlo después)
- Base de datos: Almacenamiento local (localstorage)


Preferencias generales:

- Todos los textos visibles de la web quiero que estén en inglés.



Preferencias de diseño:

- Básate en los documento HTML del diseño que tienes en la carpeta design del proyecto



Preferencias de estilos:

- Colores (los del diseño)

- Uso de medidas con rem, usando un font-size base de 10px.

- Uso de HTML5 y CSS3 nativo con metodología BEM

- Usa buenas practicas de maquetación css metodologia BEM y si es necesario usa flexbox y css grid layout.

- Que la webapp sea responsive.



Preferencias de código:


- HTML debe ser semantico.

- Usa siempre let o const, y no uses nunca var.

- No uses alert, confirm, prompt, todo el feedback debe ser visual en el dom.

- Toda alerta o ventana modal que aparezca debe tener el mismo tipo de estilos que la web.

- No uses innerHTML, todo el contenido debe ser insertado con appendChild, o previamente creando un elemento con document.createElement

- Cuidado con olvidar prevenir el default en los eventos submit o click.

- Prioriza el codigo legible y mantenible.

- Prioriza que el codigo sea sencillo de entender.

- Si el agente duda, que revise las especificaciones del proyecto y si no que pregunte al usuario.



Estructura de archivos:

- carpeta (design)

- AGENTS.md

- Estructura de carpetas más adecuada para proyectos de React.









