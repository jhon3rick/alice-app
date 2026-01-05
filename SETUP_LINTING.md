# Configuración de Linting y Formateo

## Estado Actual

✅ Archivos de configuración creados:
- `.vscode/settings.json` - Configuración de VSCode
- `.vscode/extensions.json` - Extensiones recomendadas
- `.vscode/tasks.json` - Tareas útiles
- `.eslintrc.json` - Configuración de ESLint
- `.prettierrc` - Configuración de Prettier
- `.prettierignore` - Archivos ignorados por Prettier
- `.editorconfig` - Configuración universal de editor

✅ ESLint está funcionando y detectando errores (probado con CLI)

⚠️ Falta: Instalar dependencias para integración completa

## Paso 1: Instalar dependencias faltantes

Ejecuta este comando para instalar Prettier y la integración con ESLint:

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

## Paso 2: Actualizar .eslintrc.json

Después de instalar las dependencias, actualiza el archivo `.eslintrc.json`:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
    "prettier"  // ← Agregar esta línea
  ]
}
```

## Paso 3: Reiniciar VSCode

1. Presiona `Cmd + Shift + P` (macOS) o `Ctrl + Shift + P` (Windows/Linux)
2. Escribe "Reload Window" y presiona Enter
3. O cierra y vuelve a abrir VSCode

## Verificación

Después de reiniciar VSCode, deberías ver:

✅ Errores de ESLint subrayados en rojo en el editor
✅ Variables no usadas marcadas
✅ Formateo automático al guardar
✅ Espacios en blanco eliminados automáticamente

## Errores Encontrados en ProjectList.tsx

El archivo `src/renderer/views/ProjectList.tsx` tiene 11 imports no usados:

- `Typography`, `IconButton`, `Table`, `TableBody`, `TableCell`, `TableContainer`, `TableHead`, `TableRow`, `Paper` (de @mui/material)
- `Edit`, `Delete` (de @mui/icons-material)

### Solución Automática

```bash
npm run lint -- --fix
```

### Solución Manual

Elimina estos imports del archivo.

## Comandos Útiles

```bash
# Lint de todo el proyecto
npm run lint

# Lint con auto-fix
npm run lint -- --fix

# Formatear todos los archivos con Prettier (después de instalar)
npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,scss}"

# Verificar formateo sin modificar
npx prettier --check "src/**/*.{ts,tsx,js,jsx,json,css,scss}"
```

## Extensiones de VSCode Requeridas

Instala estas extensiones (VSCode te las recomendará automáticamente):

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
3. **TypeScript and JavaScript Language Features** (incluida en VSCode)

## Notas

- Los archivos se formatearán automáticamente al guardar
- ESLint arreglará problemas automáticamente cuando sea posible
- Los imports se organizarán automáticamente
- Variables que empiezan con `_` no se marcarán como no usadas (ejemplo: `_unusedVar`)
