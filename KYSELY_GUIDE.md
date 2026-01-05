# Guía de Kysely - Type-safe SQL Query Builder

Esta aplicación ahora utiliza **Kysely** como query builder con tipado seguro de TypeScript para todas las operaciones de base de datos.

## ¿Qué es Kysely?

Kysely es un query builder SQL con type-safety completo para TypeScript. Proporciona:
- **Autocompletado inteligente**: TypeScript sabe qué columnas y tablas existen
- **Validación en tiempo de compilación**: Los errores SQL se detectan antes de ejecutar
- **Refactorización segura**: Cambiar el schema actualiza automáticamente todos los tipos
- **API fluida e intuitiva**: Queries legibles y fáciles de escribir

## Estructura de Archivos

```
src/main/database/
├── schema.ts          # Definiciones de tipos de todas las tablas
└── Database.ts        # Servicio de base de datos con Kysely
```

## Schema de Base de Datos

El archivo [schema.ts](src/main/database/schema.ts) contiene:

### 1. Interfaces de Tablas
```typescript
export interface CommandsTable {
  id: Generated<number>;              // Auto-generado
  codeindex: string | null;
  name: string;
  detail: string;
  resumen: string;
  steps: string;                       // JSON string
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}
```

### 2. Database Interface
```typescript
export interface Database {
  projects: ProjectsTable;
  tags: TagsTable;
  commands: CommandsTable;
  command_projects: CommandProjectsTable;
  command_tags: CommandTagsTable;
  config: ConfigTable;
}
```

### 3. Helper Types
```typescript
export type Command = Selectable<CommandsTable>;      // Para SELECT
export type NewCommand = Insertable<CommandsTable>;   // Para INSERT
export type CommandUpdate = Updateable<CommandsTable>; // Para UPDATE
```

## Ejemplos de Uso

### SELECT - Obtener registros

```typescript
// Select simple
const projects = await db
  .selectFrom('projects')
  .selectAll()
  .orderBy('name', 'asc')
  .execute();

// Select con WHERE
const command = await db
  .selectFrom('commands')
  .selectAll()
  .where('id', '=', commandId)
  .executeTakeFirst();

// Select con JOIN
const projects = await db
  .selectFrom('projects as p')
  .innerJoin('command_projects as cp', 'p.id', 'cp.project_id')
  .select('p.name')
  .where('cp.command_id', '=', commandId)
  .execute();

// Select con filtros complejos
const commands = await db
  .selectFrom('commands as c')
  .selectAll('c')
  .where((eb) =>
    eb.or([
      eb('c.name', 'like', '%search%'),
      eb('c.detail', 'like', '%search%')
    ])
  )
  .execute();

// Select con subconsulta
const commands = await db
  .selectFrom('commands')
  .selectAll()
  .where('id', 'in', (eb) =>
    eb
      .selectFrom('command_tags')
      .select('command_id')
      .where('tag_id', 'in', tagIds)
  )
  .execute();
```

### INSERT - Crear registros

```typescript
// Insert simple
const result = await db
  .insertInto('projects')
  .values({
    name: 'Nuevo Proyecto',
    path: '/path/to/project',
    codeindex: 'PROJ-001',
  })
  .executeTakeFirstOrThrow();

const newId = Number(result.insertId);

// Insert múltiple
await db
  .insertInto('command_tags')
  .values([
    { command_id: 1, tag_id: 10 },
    { command_id: 1, tag_id: 20 },
    { command_id: 1, tag_id: 30 },
  ])
  .execute();

// Insert con conflicto (UPSERT)
await db
  .insertInto('config')
  .values({
    key: 'theme',
    value: 'dark',
  })
  .onConflict((oc) =>
    oc.column('key').doUpdateSet({
      value: 'dark',
      updated_at: new Date().toISOString(),
    })
  )
  .execute();
```

### UPDATE - Actualizar registros

```typescript
// Update simple
await db
  .updateTable('projects')
  .set({
    name: 'Proyecto Actualizado',
    updated_at: new Date().toISOString(),
  })
  .where('id', '=', projectId)
  .execute();

// Update con múltiples condiciones
await db
  .updateTable('commands')
  .set({
    name: newName,
    detail: newDetail,
    updated_at: new Date().toISOString(),
  })
  .where('id', '=', commandId)
  .where('codeindex', 'is not', null)
  .execute();
```

### DELETE - Eliminar registros

```typescript
// Delete simple
await db
  .deleteFrom('projects')
  .where('id', '=', projectId)
  .execute();

// Delete con múltiples condiciones
await db
  .deleteFrom('command_tags')
  .where('command_id', '=', commandId)
  .where('tag_id', 'in', tagIds)
  .execute();
```

## Queries Complejas

### LEFT JOIN con condiciones OR

```typescript
let query = db
  .selectFrom('commands as c')
  .selectAll('c')
  .distinct();

if (projectId) {
  query = query
    .leftJoin('command_projects as cp', 'c.id', 'cp.command_id')
    .where((eb) =>
      eb.or([
        eb('cp.project_id', '=', projectId),
        eb('cp.project_id', 'is', null),
      ])
    );
}

const commands = await query.execute();
```

### Transacciones (si necesitas atomicidad)

```typescript
await db.transaction().execute(async (trx) => {
  // Crear comando
  const result = await trx
    .insertInto('commands')
    .values({ name: 'Cmd', detail: 'Detail', resumen: 'Resume', steps: '[]' })
    .executeTakeFirstOrThrow();

  const commandId = Number(result.insertId);

  // Asociar proyectos
  await trx
    .insertInto('command_projects')
    .values({ command_id: commandId, project_id: 1 })
    .execute();

  // Si algo falla, se hace rollback automático
});
```

## Mejores Prácticas

### 1. Usa los tipos helper
```typescript
// ✅ BIEN
const newProject: NewProject = {
  name: 'Proyecto',
  path: '/path',
  codeindex: null,
};

// ❌ MAL - Objeto sin tipo
const newProject = {
  name: 'Proyecto',
  path: '/path',
};
```

### 2. Evita non-null assertions
```typescript
// ✅ BIEN
if (filters?.projectId !== undefined) {
  const projectId = filters.projectId;
  query = query.where('project_id', '=', projectId);
}

// ❌ MAL
query = query.where('project_id', '=', filters.projectId!);
```

### 3. Maneja valores null explícitamente
```typescript
// ✅ BIEN
codeindex: project.codeindex || null,

// ❌ MAL
codeindex: project.codeindex || undefined,
```

### 4. Usa async/await consistentemente
```typescript
// ✅ BIEN
ipcMain.handle('get-projects', async () => {
  return await db.selectFrom('projects').selectAll().execute();
});

// ❌ MAL (sin async/await)
ipcMain.handle('get-projects', () => {
  return db.selectFrom('projects').selectAll().execute();
});
```

## Ventajas sobre SQL Directo

### Antes (better-sqlite3 directo)
```typescript
const stmt = db.prepare(`
  SELECT DISTINCT c.* FROM commands c
  LEFT JOIN command_projects cp ON c.id = cp.command_id
  WHERE cp.project_id = ? OR cp.project_id IS NULL
`);
const commands = stmt.all(projectId);
```

**Problemas:**
- No hay autocompletado
- Errores de sintaxis solo en runtime
- Difícil de refactorizar
- Fácil inyección SQL si no se usa prepare

### Ahora (Kysely)
```typescript
const commands = await db
  .selectFrom('commands as c')
  .leftJoin('command_projects as cp', 'c.id', 'cp.command_id')
  .selectAll('c')
  .where((eb) =>
    eb.or([
      eb('cp.project_id', '=', projectId),
      eb('cp.project_id', 'is', null),
    ])
  )
  .execute();
```

**Ventajas:**
- ✅ Autocompletado completo
- ✅ Errores en tiempo de compilación
- ✅ Refactorización automática
- ✅ Protección contra inyección SQL
- ✅ Código más legible y mantenible

## Recursos Adicionales

- [Documentación oficial de Kysely](https://kysely.dev/)
- [Kysely API Reference](https://kysely-org.github.io/kysely-apidoc/)
- [GitHub Repository](https://github.com/kysely-org/kysely)

## Archivos Modificados

Los siguientes archivos fueron actualizados para usar Kysely:

1. ✅ [src/main/database/schema.ts](src/main/database/schema.ts) - Nuevos tipos
2. ✅ [src/main/database/Database.ts](src/main/database/Database.ts) - Inicialización de Kysely
3. ✅ [src/main/services/handlerModules/apiCommands.ts](src/main/services/handlerModules/apiCommands.ts)
4. ✅ [src/main/services/handlerModules/apiProjects.ts](src/main/services/handlerModules/apiProjects.ts)
5. ✅ [src/main/services/handlerModules/apiTags.ts](src/main/services/handlerModules/apiTags.ts)
6. ✅ [src/main/services/handlerModules/apiConfig.ts](src/main/services/handlerModules/apiConfig.ts)
7. ✅ [src/main/services/handlerModules/apiImportExport.ts](src/main/services/handlerModules/apiImportExport.ts)

Todos los handlers IPC ahora usan Kysely con type-safety completo.
