# Alice App

Alice App is an Electron-based application designed to help development teams manage and execute command templates with a visual interface. It solves the problem of complex CLI commands by providing a step-by-step interface to fill in variables and execute commands safely.

## Features

- **Command Template Management**: Create, edit, and organize command templates
- **Visual Variable Input**: Fill in command variables through a user-friendly interface
- **Integrated Terminal**: Execute commands and see real-time output
- **Project Management**: Organize commands by projects with specific execution paths
- **Tag System**: Categorize and filter commands using tags
- **Format Validation**: Automatic formatting for variables (snake_case, camelCase, upperCamelCase, etc.)
- **JSON Import/Export**: Share command templates across teams using JSON files
- **SQLite Database**: Fast and reliable local storage

## Tech Stack

- **Electron Forge** - Desktop application framework
- **React** - UI library
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library
- **TypeScript** - Type safety
- **SQLite** - Local database
- **SASS** - Styling

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the app in development mode:
```bash
npm start
```

### Build

Build the application for production:
```bash
npm run make
```

## Project Structure

```
alice-app/
├── src/
│   ├── main/
│   │   ├── database/        # SQLite database setup
│   │   └── services/        # IPC handlers
│   ├── renderer/
│   │   ├── components/      # React components
│   │   ├── views/           # Page views
│   │   ├── store/           # Redux slices
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main React component
│   ├── index.ts             # Electron main process
│   ├── preload.ts           # Preload script
│   └── renderer.ts          # React entry point
└── example-config.json      # Example configuration file
```

## Usage

### Home Screen

The home screen provides access to four main sections:
- **Commands**: Browse and execute command templates
- **Projects**: Manage project configurations
- **Tags**: Organize tags for filtering
- **Config**: Configure application settings

### Creating a Command Template

1. Navigate to **Commands**
2. Click **Add Command**
3. Fill in:
   - Name
   - Detail (full explanation)
   - Resumen (short summary)
   - Tags (for filtering)
   - Projects (optional, where to execute)
   - Steps with variables

### Variable Types

- **string**: Free text input with optional formatting
- **option**: Dropdown selection from predefined options
- **number**: Numeric input
- **boolean**: True/false selection

### Variable Formats

- `snake_case`: lowercase_with_underscores
- `camelCase`: firstWordLowercaseRestCapitalized
- `upperCamelCase`: AllWordsCapitalized
- `kebab-case`: lowercase-with-hyphens
- `UPPER_CASE`: UPPERCASE_WITH_UNDERSCORES

### JSON Configuration

See `example-config.json` for the structure. You can:
1. Create JSON files with command templates
2. Import them via **Config** → **Import JSON**
3. Export your database to JSON via **Config** → **Export to JSON**

### Example Command Template

```json
{
  "codeindex": "unique-id",
  "name": "Add Migration",
  "detail": "Long explanation of what this does",
  "resumen": "Short summary",
  "project": ["project-codeindex-1"],
  "tags": ["migration", "rails"],
  "steps": [
    {
      "name": "Generate Migration",
      "detail": "Creates the migration file",
      "command": "rails g migration Add{{fieldName}}To{{tableName}} {{field_name}}:{{fieldType}}",
      "variables": [
        {
          "name": "fieldName",
          "type": "string",
          "detail": "Field name in UpperCamelCase",
          "format": "upperCamelCase"
        },
        {
          "name": "tableName",
          "type": "string",
          "detail": "Table name in UpperCamelCase",
          "format": "upperCamelCase"
        },
        {
          "name": "field_name",
          "type": "string",
          "detail": "Field name in snake_case",
          "format": "snake_case"
        },
        {
          "name": "fieldType",
          "type": "option",
          "detail": "Column type",
          "options": ["string", "integer", "boolean"]
        }
      ]
    }
  ]
}
```

## Database

The application uses SQLite for local storage. The database is automatically created in the user's application data directory.

Tables:
- `projects` - Project configurations
- `tags` - Available tags
- `command_templates` - Command templates
- `command_projects` - Many-to-many relationship
- `command_tags` - Many-to-many relationship
- `config` - Application settings

## Development

### Adding a New View

1. Create a new component in `src/renderer/views/`
2. Add the route in `src/renderer/App.tsx`
3. Update navigation as needed

### Adding a New IPC Handler

1. Add the handler in `src/main/services/ipcHandlers.ts`
2. Expose it in `src/preload.ts`
3. Use it in your React components via `window.electronAPI`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
