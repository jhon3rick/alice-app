# Alice App

> 🚧 **PROYECTO EN CONSTRUCCIÓN** - Este proyecto está actualmente en desarrollo activo. Algunas funcionalidades pueden estar incompletas o sujetas a cambios.

**Proyecto Personal** | Un gestor visual de plantillas de comandos para desarrolladores

Alice App es una aplicación de escritorio basada en Electron diseñada para resolver un problema común en el desarrollo de software: **la gestión, estandarización y ejecución segura de comandos CLI complejos y repetitivos**. Permite crear plantillas con variables controladas mediante selectores, limitando las opciones disponibles y asegurando la consistencia en los comandos ejecutados por todo el equipo.

## El Problema

Los desarrolladores frecuentemente ejecutan comandos largos y complejos que requieren múltiples parámetros, nombres de archivos específicos, y convenciones de formato (camelCase, snake_case, etc.). Estos comandos son propensos a errores tipográficos, difíciles de recordar, complicados de compartir con el equipo, y **carecen de estandarización**, lo que resulta en comandos ejecutados de manera inconsistente entre diferentes miembros del equipo.

## La Solución

Alice App proporciona una interfaz visual intuitiva donde puedes:

- **Crear plantillas estandarizadas** de comandos con variables parametrizadas
- **Controlar las opciones** mediante selectores dropdown que limitan valores a opciones predefinidas
- **Validar formatos automáticamente** (snake_case, camelCase, etc.) antes de la ejecución
- **Garantizar consistencia** en todos los comandos ejecutados por el equipo
- Ejecutar comandos con un terminal integrado que muestra el output en tiempo real
- Organizar comandos por proyectos y etiquetas para fácil acceso
- Compartir plantillas estandarizadas con tu equipo mediante archivos JSON

En lugar de memorizar `rails g migration AddUsernameTo{{TableName}} username:string:uniq`, simplemente seleccionas la plantilla y completas los campos en un formulario visual.

## Características

- **Gestión de Plantillas de Comandos**: Crea, edita y organiza plantillas de comandos
- **Entrada Visual de Variables**: Completa variables de comandos mediante una interfaz amigable
- **Terminal Integrada**: Ejecuta comandos y visualiza la salida en tiempo real
- **Gestión de Proyectos**: Organiza comandos por proyectos con rutas de ejecución específicas
- **Sistema de Etiquetas**: Categoriza y filtra comandos usando etiquetas
- **Validación de Formatos**: Formateo automático para variables (snake_case, camelCase, upperCamelCase, etc.)
- **Importación/Exportación JSON**: Comparte plantillas de comandos entre equipos usando archivos JSON
- **Base de Datos SQLite**: Almacenamiento local rápido y confiable

## Stack Tecnológico

![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

- **Electron Forge** - Framework para aplicaciones de escritorio
- **React** - Librería de UI con React Router para navegación
- **Redux Toolkit** - Gestión de estado
- **Material-UI (MUI)** - Librería de componentes
- **TypeScript** - Tipado estático
- **SQLite** - Base de datos local
- **SASS (SCSS)** - Estilos con metodología BEM

## Comenzando

### Instalación

1. Instalar dependencias:

```bash
npm install
```

### Desarrollo

Ejecutar la aplicación en modo desarrollo:
```bash
npm start
```

### Compilación

Compilar la aplicación para producción:
```bash
npm run make
```

## Estructura del Proyecto

```
alice-app/
├── src/
│   ├── main/
│   │   ├── database/
│   │   │   ├── index.ts              # Inicialización de base de datos
│   │   │   └── schema.sql            # Esquema de base de datos
│   │   └── services/
│   │       └── ipcHandlers.ts        # Manejadores de comunicación IPC
│   ├── renderer/
│   │   ├── components/
│   │   │   ├── ModalNewCommand.tsx   # Modal de creación de comandos
│   │   │   ├── ModalNewProject.tsx   # Modal de creación de proyectos
│   │   │   ├── ModalNewTag.tsx       # Modal de creación de etiquetas
│   │   │   └── Terminal.tsx          # Componente de terminal
│   │   ├── views/
│   │   │   ├── CommandList.tsx       # Vista de lista de comandos
│   │   │   ├── CommandList.scss      # Estilos de lista de comandos
│   │   │   ├── CommandDetail.tsx     # Vista de ejecución de comandos
│   │   │   ├── ProjectList.tsx       # Gestión de proyectos
│   │   │   ├── TagList.tsx           # Gestión de etiquetas
│   │   │   ├── TagList.scss          # Estilos de etiquetas
│   │   │   ├── ConfigView.tsx        # Vista de configuración
│   │   │   ├── Home.tsx              # Dashboard principal
│   │   │   └── Splash.tsx            # Pantalla de inicio
│   │   ├── ui/
│   │   │   ├── ViewContainer.tsx     # Contenedor de vista estilo Metro
│   │   │   ├── ViewContainer.scss    # Estilos del contenedor
│   │   │   ├── ViewBackButton.tsx    # Botón de navegación atrás
│   │   │   └── ViewTitle.tsx         # Componente de título de página
│   │   ├── store/
│   │   │   ├── index.ts              # Configuración de Redux store
│   │   │   ├── hooks.ts              # Hooks tipados de Redux
│   │   │   ├── commandsSlice.ts      # Estado de comandos
│   │   │   ├── projectsSlice.ts      # Estado de proyectos
│   │   │   └── tagsSlice.ts          # Estado de etiquetas
│   │   ├── types/
│   │   │   └── index.ts              # Definiciones de tipos TypeScript
│   │   ├── utils/
│   │   │   ├── formatValidation.ts   # Funciones de validación de formato
│   │   │   └── homeModules.tsx       # Configuración de módulos del home
│   │   └── App.tsx                   # Componente principal de React con routing
│   ├── index.ts                      # Proceso principal de Electron
│   ├── preload.ts                    # Script de preload (puente IPC)
│   └── renderer.ts                   # Punto de entrada de React
├── webpack.main.config.ts            # Configuración de Webpack para main
├── webpack.renderer.config.ts        # Configuración de Webpack para renderer
├── webpack.plugins.ts                # Plugins de Webpack
├── tsconfig.json                     # Configuración de TypeScript
├── example-config.json               # Archivo de configuración de ejemplo
└── package.json                      # Dependencias y scripts
```

## Arquitectura

### Patrón de Diseño

- **BEM (Block Element Modifier)** para nomenclatura de clases SCSS
- **Diseño Metro/Outlook** para componentes UI (botones grandes, interfaz minimalista)
- **Arquitectura basada en componentes** con separación de responsabilidades

### Alias de Rutas

- `@/` - src/
- `@main/` - src/main/
- `@renderer/` - src/renderer/
- `@components/` - src/renderer/components/
- `@views/` - src/renderer/views/
- `@store/` - src/renderer/store/
- `@types/` - src/renderer/types/
- `@utils/` - src/renderer/utils/
- `@ui/` - src/renderer/ui/

### Paleta de Colores

- Primary Dark: `#005461`
- Primary Main: `#018790`
- Primary Light: `#00B7B5`
- Background: `#F4F4F4`

## Uso

### Pantalla Principal

La pantalla principal proporciona acceso a cuatro secciones principales:

- **Commands**: Navegar y ejecutar plantillas de comandos
- **Projects**: Gestionar configuraciones de proyectos
- **Tags**: Organizar etiquetas para filtrado
- **Config**: Configurar ajustes de la aplicación

### Crear una Plantilla de Comando

1. Navegar a **Commands**
2. Hacer clic en **Add Command**
3. Completar:
   - Name (nombre)
   - Detail (explicación completa)
   - Resumen (resumen breve)
   - Tags (para filtrado)
   - Projects (opcional, dónde ejecutar)
   - Steps con variables

### Tipos de Variables

- **string**: Entrada de texto libre con formato opcional
- **option**: Selección dropdown de opciones predefinidas
- **number**: Entrada numérica
- **boolean**: Selección verdadero/falso

### Formatos de Variables

- `snake_case`: minúsculas_con_guiones_bajos
- `camelCase`: primeraPalabraMinúsculaRestoCapitalizado
- `upperCamelCase`: TodasPalabrasCapitalizadas
- `kebab-case`: minúsculas-con-guiones
- `UPPER_CASE`: MAYÚSCULAS_CON_GUIONES_BAJOS

### Configuración JSON

Consulta `example-config.json` para ver la estructura. Puedes:

1. Crear archivos JSON con plantillas de comandos
2. Importarlos vía **Config** → **Import JSON**
3. Exportar tu base de datos a JSON vía **Config** → **Export to JSON**

### Ejemplo de Plantilla de Comando

```json
{
  "codeindex": "unique-id",
  "name": "Add Migration",
  "detail": "Explicación larga de lo que hace esto",
  "resumen": "Resumen corto",
  "project": ["project-codeindex-1"],
  "tags": ["migration", "rails"],
  "steps": [
    {
      "name": "Generate Migration",
      "detail": "Crea el archivo de migración",
      "command": "rails g migration Add{{fieldName}}To{{tableName}} {{field_name}}:{{fieldType}}",
      "variables": [
        {
          "name": "fieldName",
          "type": "string",
          "detail": "Nombre del campo en UpperCamelCase",
          "format": "upperCamelCase"
        },
        {
          "name": "tableName",
          "type": "string",
          "detail": "Nombre de la tabla en UpperCamelCase",
          "format": "upperCamelCase"
        },
        {
          "name": "field_name",
          "type": "string",
          "detail": "Nombre del campo en snake_case",
          "format": "snake_case"
        },
        {
          "name": "fieldType",
          "type": "option",
          "detail": "Tipo de columna",
          "options": ["string", "integer", "boolean"]
        }
      ]
    }
  ]
}
```

## Base de Datos

La aplicación usa SQLite para almacenamiento local. La base de datos se crea automáticamente en el directorio de datos de la aplicación del usuario.

Tablas:

- `projects` - Configuraciones de proyectos
- `tags` - Etiquetas disponibles
- `command_templates` - Plantillas de comandos
- `command_projects` - Relación muchos a muchos
- `command_tags` - Relación muchos a muchos
- `config` - Configuración de la aplicación

## Guía de Desarrollo

### Agregar una Nueva Vista

1. Crear un nuevo componente en `src/renderer/views/`
2. Agregar la ruta en `src/renderer/App.tsx`
3. Actualizar la navegación según sea necesario
4. Usar el componente `ViewContainer` para un diseño Metro consistente

### Agregar un Nuevo Manejador IPC

1. Agregar el manejador en `src/main/services/ipcHandlers.ts`
2. Exponerlo en `src/preload.ts`
3. Usarlo en tus componentes React vía `window.electronAPI`

### Convenciones de Nomenclatura

- **Vistas**: Forma singular (ej. `CommandList`, `ProjectList`, `TagList`)
- **Componentes**: Nombres descriptivos (ej. `ModalNewCommand`, `ViewContainer`)
- **SCSS**: Metodología BEM (ej. `.command-list__filters`)

## Esquema del Sistema

### Arquitectura General

```mermaid
graph TB
    subgraph "RENDERER PROCESS (Frontend - React)"
        subgraph "Views Layer"
            Home[Home]
            CommandList[CommandList]
            CommandDetail[CommandDetail]
            ProjectList[ProjectList]
            TagList[TagList]
            ConfigView[ConfigView]
        end

        subgraph "UI Components"
            ViewContainer[ViewContainer<br/>Metro UI]
            ModalNewCommand[ModalNewCommand]
            ModalNewProject[ModalNewProject]
            ModalNewTag[ModalNewTag]
            Terminal[Terminal]
        end

        subgraph "Redux Store"
            commandsSlice[commandsSlice<br/>• commands<br/>• currentCommand<br/>• filters]
            projectsSlice[projectsSlice<br/>• projects<br/>• loading]
            tagsSlice[tagsSlice<br/>• tags<br/>• loading]
        end

        subgraph "Utils"
            formatValidation[formatValidation<br/>• snake_case<br/>• camelCase<br/>• upperCamelCase]
            homeModules[homeModules<br/>• Navigation config]
        end
    end

    subgraph "IPC Bridge"
        Preload[Preload Script<br/>window.electronAPI]
    end

    subgraph "MAIN PROCESS (Backend - Electron)"
        subgraph "IPC Handlers"
            IPCHandlers[IPC Handlers<br/>• commands:get/create/update<br/>• projects:get/create/update<br/>• tags:get/create/update]
        end

        subgraph "Database"
            SQLite[(SQLite DB<br/>• command_templates<br/>• projects<br/>• tags<br/>• command_projects<br/>• command_tags<br/>• config)]
        end

        subgraph "Execution"
            TerminalExec[Terminal Execution<br/>child_process.spawn<br/>stdout/stderr streaming]
        end
    end

    Home --> ViewContainer
    CommandList --> ViewContainer
    ProjectList --> ViewContainer
    TagList --> ViewContainer

    CommandList --> ModalNewCommand
    ProjectList --> ModalNewProject
    TagList --> ModalNewTag
    CommandDetail --> Terminal

    CommandList --> commandsSlice
    ProjectList --> projectsSlice
    TagList --> tagsSlice
    CommandDetail --> commandsSlice

    commandsSlice --> Preload
    projectsSlice --> Preload
    tagsSlice --> Preload

    Preload <--> IPCHandlers
    IPCHandlers <--> SQLite
    IPCHandlers --> TerminalExec

    style Home fill:#018790,color:#fff
    style CommandList fill:#018790,color:#fff
    style ProjectList fill:#018790,color:#fff
    style TagList fill:#018790,color:#fff
    style ViewContainer fill:#00B7B5,color:#fff
    style commandsSlice fill:#005461,color:#fff
    style projectsSlice fill:#005461,color:#fff
    style tagsSlice fill:#005461,color:#fff
    style SQLite fill:#07405E,color:#fff
```

### Flujo de Datos: Ejecución de Comando

```mermaid
sequenceDiagram
    participant U as Usuario
    participant R as Renderer<br/>(CommandDetail)
    participant S as Redux Store
    participant P as Preload Script
    participant M as Main Process<br/>(IPC Handler)
    participant T as Terminal<br/>(child_process)
    participant SYS as Sistema

    U->>R: 1. Click Execute
    R->>S: 2. dispatch(executeCommand)
    S->>P: 3. window.electronAPI.executeCommand(template, vars)
    P->>M: 4. IPC: executeCommand

    Note over M: Parse template<br/>Apply variables<br/>Format values

    M->>T: 5. spawn(command, args)
    T->>SYS: 6. Execute command

    loop Streaming
        SYS-->>T: stdout/stderr
        T-->>M: Stream data
        M-->>P: Send output
        P-->>S: Update terminal state
        S-->>R: Re-render
        R-->>U: Display output
    end

    SYS-->>T: Exit code
    T-->>M: Process complete
    M-->>P: Execution finished
    P-->>S: Update state
    S-->>R: Show complete
```

### Modelo de Datos

```mermaid
erDiagram
    COMMAND_TEMPLATES ||--o{ COMMAND_PROJECTS : "belongs to"
    COMMAND_TEMPLATES ||--o{ COMMAND_TAGS : "has"
    PROJECTS ||--o{ COMMAND_PROJECTS : "contains"
    TAGS ||--o{ COMMAND_TAGS : "categorizes"

    COMMAND_TEMPLATES {
        int id PK
        string codeindex
        string name
        string detail
        string resumen
        json steps
    }

    PROJECTS {
        int id PK
        string codeindex
        string name
        string path
    }

    TAGS {
        int id PK
        string codeindex
        string name
    }

    COMMAND_PROJECTS {
        int command_id FK
        int project_id FK
    }

    COMMAND_TAGS {
        int command_id FK
        int tag_id FK
    }

    CONFIG {
        string key PK
        string value
    }
```

### Estructura de Componentes React

```mermaid
graph TD
    App[App.tsx<br/>Router + Theme]

    App --> Splash[Splash<br/>Pantalla de inicio]
    App --> Home[Home<br/>Dashboard]
    App --> CommandList[CommandList<br/>Lista de comandos]
    App --> CommandDetail[CommandDetail<br/>Ejecutar comando]
    App --> ProjectList[ProjectList<br/>Gestión proyectos]
    App --> TagList[TagList<br/>Gestión tags]
    App --> ConfigView[ConfigView<br/>Configuración]

    CommandList --> ViewContainer1[ViewContainer]
    ProjectList --> ViewContainer2[ViewContainer]
    TagList --> ViewContainer3[ViewContainer]

    ViewContainer1 --> ViewBackButton1[ViewBackButton]
    ViewContainer1 --> ViewTitle1[ViewTitle]

    CommandList --> ModalNewCommand[ModalNewCommand]
    ProjectList --> ModalNewProject[ModalNewProject]
    TagList --> ModalNewTag[ModalNewTag]

    CommandDetail --> Terminal[Terminal<br/>Ejecución en tiempo real]

    style App fill:#018790,color:#fff
    style ViewContainer1 fill:#00B7B5,color:#fff
    style ViewContainer2 fill:#00B7B5,color:#fff
    style ViewContainer3 fill:#00B7B5,color:#fff
    style Terminal fill:#005461,color:#fff
```

## Licencia

MIT

## Contribuir

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.
