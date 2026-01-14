/**
 * Tags Seed Data
 *
 * Initial tags based on available SVGL icons plus additional popular technologies.
 * These tags will be automatically loaded when the database is initialized or reset.
 */

import { NewTag } from '../schema';

export const tagsSeed: Omit<NewTag, 'id' | 'created_at' | 'updated_at'>[] = [
  // Programming Languages
  { codeindex: 'c', name: 'C', icon: 'C' },
  { codeindex: 'cpp', name: 'C++', icon: 'CPlusPlus' },
  { codeindex: 'csharp', name: 'C#', icon: 'CSharp' },
  { codeindex: 'dart', name: 'Dart', icon: 'Dart' },
  { codeindex: 'fortran', name: 'Fortran', icon: 'Fortran' },
  { codeindex: 'go', name: 'Go', icon: 'GoDark' },
  { codeindex: 'haskell', name: 'Haskell', icon: 'Haskell' },
  { codeindex: 'java', name: 'Java', icon: 'Java' },
  { codeindex: 'javascript', name: 'JavaScript', icon: 'JavaScript' },
  { codeindex: 'julia', name: 'Julia', icon: 'Julia' },
  { codeindex: 'kotlin', name: 'Kotlin', icon: 'Kotlin' },
  { codeindex: 'lua', name: 'Lua', icon: 'Lua' },
  { codeindex: 'matlab', name: 'MATLAB', icon: 'Matlab' },
  { codeindex: 'php', name: 'PHP', icon: 'PhpDark' },
  { codeindex: 'python', name: 'Python', icon: 'Python' },
  { codeindex: 'r', name: 'R', icon: 'RDark' },
  { codeindex: 'ruby', name: 'Ruby', icon: 'Ruby' },
  { codeindex: 'rust', name: 'Rust', icon: 'RustDark' },
  { codeindex: 'scala', name: 'Scala', icon: 'Scala' },
  { codeindex: 'solidity', name: 'Solidity', icon: 'Solidity' },
  { codeindex: 'swift', name: 'Swift', icon: 'Swift' },
  { codeindex: 'typescript', name: 'TypeScript', icon: 'TypeScript' },
  { codeindex: 'zig', name: 'Zig', icon: 'Zig' },

  // Web Technologies
  { codeindex: 'css3', name: 'CSS3', icon: 'CSS' },
  { codeindex: 'html5', name: 'HTML5', icon: 'HTML5' },

  // Frontend Frameworks & Libraries
  { codeindex: 'angular', name: 'Angular', icon: 'Angular' },
  { codeindex: 'astro', name: 'Astro', icon: 'AstroDark' },
  { codeindex: 'bootstrap', name: 'Bootstrap', icon: 'Bootstrap' },
  { codeindex: 'ember', name: 'Ember', icon: 'Ember' },
  { codeindex: 'gatsby', name: 'Gatsby', icon: 'Gatsby' },
  { codeindex: 'nextjs', name: 'Next.js', icon: 'Nextjs' },
  { codeindex: 'nuxtjs', name: 'Nuxt.js', icon: 'Nuxt' },
  { codeindex: 'preact', name: 'Preact', icon: 'Preact' },
  { codeindex: 'qwik', name: 'Qwik', icon: 'Qwik' },
  { codeindex: 'react', name: 'React', icon: 'ReactDark' },
  { codeindex: 'redux', name: 'Redux', icon: 'Redux' },
  { codeindex: 'remix', name: 'Remix', icon: 'RemixDark' },
  { codeindex: 'solidjs', name: 'SolidJS', icon: 'Solidjs' },
  { codeindex: 'svelte', name: 'Svelte', icon: 'Svelte' },
  { codeindex: 'vuejs', name: 'Vue.js', icon: 'Vue' },

  // Backend Frameworks
  { codeindex: 'django', name: 'Django', icon: 'Django' },
  { codeindex: 'express', name: 'Express', icon: 'ExpressjsDark' },
  { codeindex: 'fastapi', name: 'FastAPI', icon: 'FastAPI' },
  { codeindex: 'fastify', name: 'Fastify', icon: 'FastifyDark' },
  { codeindex: 'flask', name: 'Flask', icon: 'FlaskDark' },
  { codeindex: 'hono', name: 'Hono', icon: 'Hono' },
  { codeindex: 'laravel', name: 'Laravel', icon: 'Laravel' },
  { codeindex: 'nestjs', name: 'NestJS', icon: 'NestJS' },
  { codeindex: 'rails', name: 'Rails', icon: null },
  { codeindex: 'spring', name: 'Spring', icon: 'Spring' },
  { codeindex: 'asp-net', name: 'ASP.NET', icon: 'MicrosoftNET' },

  // Runtime Environments
  { codeindex: 'bun', name: 'Bun', icon: 'Bun' },
  { codeindex: 'deno', name: 'Deno', icon: 'DenoDark' },
  { codeindex: 'nodejs', name: 'Node.js', icon: 'Nodejs' },

  // Build Tools & Bundlers
  { codeindex: 'esbuild', name: 'Esbuild', icon: 'Esbuild' },
  { codeindex: 'parcel', name: 'Parcel', icon: 'Parcel' },
  { codeindex: 'rolldown', name: 'Rolldown', icon: 'Rolldown' },
  { codeindex: 'rsbuild', name: 'Rsbuild', icon: 'Rsbuild' },
  { codeindex: 'rspack', name: 'Rspack', icon: 'Rspack' },
  { codeindex: 'swc', name: 'SWC', icon: 'SWC' },
  { codeindex: 'turbopack', name: 'Turbopack', icon: 'TurbopackDark' },
  { codeindex: 'vite', name: 'Vite', icon: 'Vite' },
  { codeindex: 'webpack', name: 'Webpack', icon: null },

  // Package Managers
  { codeindex: 'npm', name: 'NPM', icon: 'NPM' },
  { codeindex: 'pnpm', name: 'PNPM', icon: 'PnpmDark' },
  { codeindex: 'yarn', name: 'Yarn', icon: 'Yarn' },

  // Databases
  { codeindex: 'cassandra', name: 'Cassandra', icon: null },
  { codeindex: 'dynamodb', name: 'DynamoDB', icon: null },
  { codeindex: 'elasticsearch', name: 'Elasticsearch', icon: null },
  { codeindex: 'mariadb', name: 'MariaDB', icon: 'MariaDB' },
  { codeindex: 'mongodb', name: 'MongoDB', icon: 'MongoDBDark' },
  { codeindex: 'mssql', name: 'Microsoft SQL Server', icon: 'MicrosoftSQLServer' },
  { codeindex: 'mysql', name: 'MySQL', icon: 'MySQLDark' },
  { codeindex: 'oracle', name: 'Oracle', icon: null },
  { codeindex: 'postgresql', name: 'PostgreSQL', icon: 'PostgreSQL' },
  { codeindex: 'redis', name: 'Redis', icon: 'Redis' },
  { codeindex: 'snowflake', name: 'Snowflake', icon: null },
  { codeindex: 'sqlite', name: 'SQLite', icon: 'SQLite' },
  { codeindex: 'surrealdb', name: 'SurrealDB', icon: 'Surrealdb' },

  // Cloud & Infrastructure
  { codeindex: 'aws', name: 'AWS', icon: 'AmazonWebServicesDark' },
  { codeindex: 'cloudflare', name: 'Cloudflare', icon: 'Cloudflare' },
  { codeindex: 'digitalocean', name: 'DigitalOcean', icon: 'DigitalOcean' },
  { codeindex: 'docker', name: 'Docker', icon: 'Docker' },
  { codeindex: 'google-cloud', name: 'Google Cloud', icon: 'GoogleCloud' },
  { codeindex: 'kubernetes', name: 'Kubernetes', icon: 'Kubernetes' },
  { codeindex: 'microsoft-azure', name: 'Microsoft Azure', icon: 'MicrosoftAzure' },
  { codeindex: 'nginx', name: 'Nginx', icon: 'Nginx' },
  { codeindex: 'terraform', name: 'Terraform', icon: 'Terraform' },
  { codeindex: 'vercel', name: 'Vercel', icon: 'VercelDark' },

  // Development Tools
  { codeindex: 'android', name: 'Android', icon: 'Android' },
  { codeindex: 'electron', name: 'Electron', icon: 'Electron' },
  { codeindex: 'eslint', name: 'ESLint', icon: 'ESLintDark' },
  { codeindex: 'figma', name: 'Figma', icon: 'Figma' },
  { codeindex: 'firebase', name: 'Firebase', icon: 'Firebase' },
  { codeindex: 'flutter', name: 'Flutter', icon: 'Flutter' },
  { codeindex: 'git', name: 'Git', icon: 'Git' },
  { codeindex: 'github', name: 'GitHub', icon: 'GitHubDark' },
  { codeindex: 'gitlab', name: 'GitLab', icon: 'GitLab' },
  { codeindex: 'graphql', name: 'GraphQL', icon: 'GraphQL' },
  { codeindex: 'jest', name: 'Jest', icon: 'Jest' },
  { codeindex: 'jquery', name: 'jQuery', icon: 'JQueryDark' },
  { codeindex: 'playwright', name: 'Playwright', icon: 'Playwright' },
  { codeindex: 'postman', name: 'Postman', icon: 'Postman' },
  { codeindex: 'prettier', name: 'Prettier', icon: 'PrettierDark' },
  { codeindex: 'vitest', name: 'Vitest', icon: 'Vitest' },

  // UI Libraries
  { codeindex: 'chakra-ui', name: 'Chakra UI', icon: 'ChakraUI' },
  { codeindex: 'daisyui', name: 'DaisyUI', icon: 'DaisyUI' },
  { codeindex: 'mantine', name: 'Mantine', icon: 'Mantine' },
  { codeindex: 'material-ui', name: 'Material UI', icon: 'MaterialUI' },
  { codeindex: 'radix-ui', name: 'Radix UI', icon: 'RadixUIDark' },
  { codeindex: 'shadcn-ui', name: 'shadcn/ui', icon: 'ShadcnUiDark' },
  { codeindex: 'tailwindcss', name: 'Tailwind CSS', icon: 'TailwindCSS' },

  // ORMs & Backend Tools
  { codeindex: 'drizzle-orm', name: 'Drizzle ORM', icon: 'DrizzleORMDark' },
  { codeindex: 'prisma', name: 'Prisma', icon: 'PrismaDark' },
  { codeindex: 'supabase', name: 'Supabase', icon: 'Supabase' },
  { codeindex: 'trpc', name: 'tRPC', icon: 'TRPC' },
  { codeindex: 'grpc', name: 'gRPC', icon: null },
  { codeindex: 'rabbitmq', name: 'RabbitMQ', icon: null },

  // CMS & Platforms
  { codeindex: 'strapi', name: 'Strapi', icon: 'Strapi' },
  { codeindex: 'wordpress', name: 'WordPress', icon: 'WordPress' },

  // Testing & Quality
  { codeindex: 'cypress', name: 'Cypress', icon: 'Cypress' },
  { codeindex: 'storybook', name: 'Storybook', icon: 'Storybook' },

  // Monorepo Tools
  { codeindex: 'nx', name: 'Nx', icon: 'NxDark' },
  { codeindex: 'turborepo', name: 'Turborepo', icon: 'TurborepoLight' },

  // Microsoft Ecosystem
  { codeindex: 'dotnet', name: '.NET', icon: 'MicrosoftNET' },

  // Other Popular Tools
  { codeindex: 'babel', name: 'Babel', icon: 'Babel' },
  { codeindex: 'bash', name: 'Bash', icon: 'BashDark' },
  { codeindex: 'linux', name: 'Linux', icon: 'Linux' },
  { codeindex: 'sass', name: 'Sass', icon: 'Sass' },
  { codeindex: 'ubuntu', name: 'Ubuntu', icon: 'Ubuntu' },
  { codeindex: 'vim', name: 'Vim', icon: 'Vim' },

  // Additional technologies without icons
  { codeindex: 'perl', name: 'Perl', icon: null },
  { codeindex: 'elixir', name: 'Elixir', icon: null },
  { codeindex: 'erlang', name: 'Erlang', icon: null },
  { codeindex: 'clojure', name: 'Clojure', icon: null },
  { codeindex: 'blazor', name: 'Blazor', icon: null },
  { codeindex: 'xamarin', name: 'Xamarin', icon: null },
  { codeindex: 'ionic', name: 'Ionic', icon: null },
  { codeindex: 'reactnative', name: 'React Native', icon: null },
];
