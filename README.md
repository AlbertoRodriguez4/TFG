# 🎉 Party Wars

**Party Wars** es una plataforma social y de gamificación para organizar y descubrir **salas de juegos privadas** y **eventos/fiestas temáticas**. Los usuarios pueden crear salas con sus propios juegos y preguntas, unirse a salas de otros usuarios, organizar eventos con venta de entradas (con generación de QR y confirmación por email), y acceder a planes de suscripción (Básico, Premium y Business) con funcionalidades ampliadas.

Este repositorio corresponde al Trabajo de Fin de Grado (TFG - DAM), rama `party-wars-funcionalidad-completada`.

> ⚠️ Proyecto académico en desarrollo. Algunos módulos (pagos, notificaciones, pruebas) están simulados o pendientes de pulir de cara a producción.

---

## 📖 Descripción general

El proyecto está dividido en cuatro grandes bloques dentro del mismo repositorio:

| Carpeta | Contenido |
|---|---|
| `party-wars/` | API REST del backend, construida con **NestJS**, **TypeORM** y **PostgreSQL**. |
| `react native party-wars/react-native-party-wars/` | Aplicación móvil cliente, construida con **React Native** y **Expo**. |
| `ParteVisual/` | Exportaciones de diseño (HTML/CSS/JS) de cada pantalla, usadas como referencia visual/prototipo. |
| `TablasBD/` | Modelo de datos: entidades TypeORM de referencia y script `testTablas.SQL` con el esquema de la base de datos. |

---

## ✨ Funcionalidades principales

**Usuarios**
- Registro e inicio de sesión (email + contraseña).
- Verificación de cuenta mediante código enviado por email.
- Edición de perfil (descripción personal, imagen de perfil vía Firebase Storage).
- Gestión de plan de suscripción: **Básico**, **Premium** y **Business**.

**Salas (Party Wars)**
- Creación de salas privadas con temática, franja de edad, ubicación, fecha y número de participantes.
- Búsqueda y filtrado de salas por nombre o temática.
- Unión de usuarios a una sala y listado de participantes.
- Asociación de juegos a una sala y ejecución de una sesión de juego.

**Juegos**
- Creación de juegos con nombre, categoría, normas y descripción.
- Banco de preguntas asociables a cada juego.
- Distinción entre juegos gratuitos y juegos **premium**.

**Eventos**
- Creación de eventos/fiestas con temática, aforo, ubicación, fecha y precio de entrada.
- Compra de entradas con selección de método de pago (simulado) y generación de un **código QR**.
- Envío del QR de confirmación por **email** al comprador.
- Búsqueda de eventos por temática.

**Planes**
- Pantallas dedicadas a los planes **Premium** y **Business** con sus ventajas diferenciales.

---

## 🧰 Stack tecnológico

**Backend — `party-wars/`**
- [NestJS](https://nestjs.com/) 10 (TypeScript)
- [TypeORM](https://typeorm.io/) + PostgreSQL (`pg`)
- `@nestjs/config` + `joi` para validación de variables de entorno
- `nodemailer` para el envío de emails (códigos de verificación y confirmación de compra)
- `qr-image` para la generación de códigos QR
- `axios` / `@nestjs/axios` para peticiones HTTP salientes
- Jest + Supertest para tests unitarios y e2e

**App móvil — `react-native-party-wars/`**
- [React Native](https://reactnative.dev/) 0.73 + [Expo](https://expo.dev/) 50
- [React Navigation](https://reactnavigation.org/) (bottom tabs + stack)
- [Firebase](https://firebase.google.com/) (Storage, para imágenes de perfil)
- `react-native-qrcode-svg` para mostrar los códigos QR de las entradas
- `react-native-paper` para componentes de UI
- `expo-image-picker` para selección de imágenes
- `@react-native-async-storage/async-storage` para persistencia local de sesión

**Base de datos**
- PostgreSQL, gestionada mediante entidades TypeORM (sincronización automática en desarrollo)

---

## 📂 Estructura del repositorio

```
TFG/
├── party-wars/                          # Backend (NestJS)
│   └── src/
│       ├── Usuario/                     # Módulo de usuarios (auth, perfil, planes)
│       ├── Sala/                        # Módulo de salas
│       ├── Juego/                       # Módulo de juegos y preguntas
│       ├── Evento/                      # Módulo de eventos y compra de entradas
│       ├── Plan/                        # Módulo de planes de suscripción
│       ├── database/                    # Configuración de conexión a PostgreSQL
│       └── main.ts
│
├── react native party-wars/
│   └── react-native-party-wars/         # App móvil (Expo)
│       └── src/
│           ├── screens/                 # Pantallas (Login, Main, CrearSala, CompraDeEntradas...)
│           ├── navigation/              # Navegación (tabs + stack)
│           └── assets/
│
├── ParteVisual/                         # Prototipos de UI exportados (HTML/CSS/JS) por pantalla
├── TablasBD/                            # Entidades de referencia + script SQL del esquema
└── README.md
```

---

## ⚙️ Puesta en marcha

### Requisitos previos
- Node.js (recomendado 18 LTS o superior)
- npm
- PostgreSQL en local o remoto
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli` o usar `npx expo`)
- Una app de **Expo Go** en el móvil, o un emulador Android/iOS, para probar la app cliente

### 1. Backend (`party-wars/`)

```bash
cd party-wars
npm install
```

Crea un archivo `.env` en la raíz de `party-wars/` con las variables descritas en la sección [Variables de entorno](#-variables-de-entorno).

```bash
# desarrollo con recarga automática
npm run start:dev

# producción
npm run build
npm run start:prod
```

Por defecto el servidor escucha en `http://localhost:3000`.

### 2. App móvil (`react native party-wars/react-native-party-wars/`)

```bash
cd "react native party-wars/react-native-party-wars"
npm install
npx expo start
```

> 📱 Las pantallas de la app llaman a la API mediante una URL fija de tipo `http://<IP-local>:3000` (por ejemplo `Main.js` o `CompraDeEntradas.js`). Si vas a probar la app en un dispositivo físico con Expo Go, **actualiza esa IP** en los ficheros de `src/screens/` por la IP local de la máquina donde corre el backend, ya que `localhost` no es accesible desde el móvil.

---

## 🔌 Variables de entorno

El backend valida su configuración con `joi` en `app.module.ts`. Variables necesarias en `party-wars/.env`:

| Variable | Descripción |
|---|---|
| `API_KEY` | Clave interna de la API |
| `DATABASE_NAME` | Nombre lógico de la base de datos (config general) |
| `DATABASE_PORT` | Puerto lógico (config general) |
| `POSTGRES_DB` | Nombre de la base de datos PostgreSQL |
| `POSTGRES_HOST` | Host del servidor PostgreSQL |
| `POSTGRES_PORT` | Puerto de PostgreSQL (habitualmente `5432`) |
| `POSTGRES_USER` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL |

Para el envío de emails (`nodemailer`) y la generación de QR también deberás configurar credenciales de un proveedor SMTP si quieres reproducir el flujo de compra de entradas.

En el cliente móvil, `FirebaseConfig.js` contiene la configuración del proyecto de Firebase (Storage) usado para las imágenes de perfil; si despliegas tu propia instancia, sustitúyelo por la configuración de tu propio proyecto de Firebase.

> 🔐 El repositorio contiene actualmente credenciales de ejemplo/desarrollo embebidas en el código (`database.module.ts`, `app.module.ts`). Antes de desplegar en producción, muévelas a variables de entorno y revócalas/rota las credenciales expuestas.

---

## 📡 Principales endpoints de la API

Todos los endpoints cuelgan de `http://localhost:3000`.

| Recurso | Endpoints destacados |
|---|---|
| `usuarios` | `GET /usuarios`, `POST /usuarios`, `GET /usuarios/login/:correo/:password`, `PUT /usuarios/:id/plan`, `POST /usuarios/send-random-code`, `POST /usuarios/verify-code` |
| `salas` | `GET /salas`, `POST /salas`, `POST /salas/:id/usuarios/:usuarioId`, `POST /salas/:id/juegos/:juegoId`, `GET /salas/tematica/:tematica` |
| `juegos` | `GET /juegos`, `POST /juegos`, `GET /juegos/:id/preguntas`, `POST /juegos/preguntas`, `GET /juegos/:categoria/categoria` |
| `eventos` | `GET /eventos`, `POST /eventos`, `POST /eventos/:id/comprar` (compra + envío de QR por email), `GET /eventos/tematica/:tematica` |
| `planes` | `GET /planes`, `POST /planes`, `PUT /planes/:id`, `DELETE /planes/:id` |

---

## 🗄️ Modelo de datos

Entidades principales y sus relaciones (definidas con TypeORM en `party-wars/src/*/Entity`):

- **Usuario** ⇄ **Sala** (muchos a muchos, tabla `usuario_sala`)
- **Usuario** ⇄ **Evento** (muchos a muchos, tabla `usuario_evento`)
- **Sala** ⇄ **Juego** (muchos a muchos, tabla `sala_juego`)
- **Juego** ⇄ **Pregunta** (muchos a muchos)
- **Usuario** tiene un `plan` (enum: `Básico`, `Premium`, `Business`)

El fichero `TablasBD/testTablas.SQL` incluye una versión del esquema en SQL (sintaxis Oracle) usada como referencia inicial durante el diseño de la base de datos.

---

## 🎨 Diseño (`ParteVisual/`)

Esta carpeta contiene una exportación estática (HTML + CSS + JS) de los prototipos visuales de cada pantalla de la aplicación (Login, Sign Up, Pantalla Principal, Crea tu juego, Partida Privada, Compra de Entradas, Configurador de Perfil, Planes Premium/Business, etc.). Sirve como referencia de diseño previa a la implementación en React Native y no forma parte del código funcional de la app.

---

## 👤 Autor

Alberto Rodríguez — Trabajo de Fin de Grado (Desarrollo de Aplicaciones Multiplataforma).

## 📄 Licencia

Proyecto académico. Sin licencia de código abierto especificada; uso educativo.
