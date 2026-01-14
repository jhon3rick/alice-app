/**
 * Available Dev Icons
 *
 * List of available technology icons from SVGL library.
 * Used across the application for consistent icon selection and rendering.
 */

import * as SVGL from '@ridemountainpig/svgl-react';
import type { ComponentType, SVGProps } from 'react';

export interface IconOption {
  name: string;
  label: string;
  variant?: 'light' | 'dark';
}

// Type for SVGL icon components
export type SvglIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// List of available SVGL icons with their base names
export const AVAILABLE_ICONS: IconOption[] = [
  // Programming Languages
  { name: 'C', label: 'C' },
  { name: 'CPlusPlus', label: 'C++' },
  { name: 'CSharp', label: 'C#' },
  { name: 'Dart', label: 'Dart' },
  { name: 'Fortran', label: 'Fortran' },
  { name: 'GoDark', label: 'Go', variant: 'dark' },
  { name: 'GoLight', label: 'Go', variant: 'light' },
  { name: 'Haskell', label: 'Haskell' },
  { name: 'Java', label: 'Java' },
  { name: 'JavaScript', label: 'JavaScript' },
  { name: 'Julia', label: 'Julia' },
  { name: 'Kotlin', label: 'Kotlin' },
  { name: 'Lua', label: 'Lua' },
  { name: 'Matlab', label: 'MATLAB' },
  { name: 'PhpDark', label: 'PHP', variant: 'dark' },
  { name: 'PhpLight', label: 'PHP', variant: 'light' },
  { name: 'Python', label: 'Python' },
  { name: 'RDark', label: 'R', variant: 'dark' },
  { name: 'RLight', label: 'R', variant: 'light' },
  { name: 'Ruby', label: 'Ruby' },
  { name: 'RustDark', label: 'Rust', variant: 'dark' },
  { name: 'RustLight', label: 'Rust', variant: 'light' },
  { name: 'Scala', label: 'Scala' },
  { name: 'Solidity', label: 'Solidity' },
  { name: 'Swift', label: 'Swift' },
  { name: 'TypeScript', label: 'TypeScript' },
  { name: 'Zig', label: 'Zig' },

  // Web Technologies
  { name: 'CSS', label: 'CSS3' },
  { name: 'HTML5', label: 'HTML5' },
  { name: 'SVG', label: 'SVG' },

  // Frontend Frameworks & Libraries
  { name: 'Angular', label: 'Angular' },
  { name: 'AstroDark', label: 'Astro', variant: 'dark' },
  { name: 'AstroLight', label: 'Astro', variant: 'light' },
  { name: 'Bootstrap', label: 'Bootstrap' },
  { name: 'Ember', label: 'Ember' },
  { name: 'Fresh', label: 'Fresh' },
  { name: 'Gatsby', label: 'Gatsby' },
  { name: 'Nextjs', label: 'Next.js' },
  { name: 'Nuxt', label: 'Nuxt.js' },
  { name: 'Preact', label: 'Preact' },
  { name: 'Qwik', label: 'Qwik' },
  { name: 'ReactDark', label: 'React', variant: 'dark' },
  { name: 'ReactLight', label: 'React', variant: 'light' },
  { name: 'ReduxDark', label: 'Redux (Dark)', variant: 'dark' },
  { name: 'Redux', label: 'Redux' },
  { name: 'RemixDark', label: 'Remix', variant: 'dark' },
  { name: 'RemixLight', label: 'Remix', variant: 'light' },
  { name: 'Solidjs', label: 'SolidJS' },
  { name: 'Svelte', label: 'Svelte' },
  { name: 'Vue', label: 'Vue.js' },

  // Backend Frameworks
  { name: 'Django', label: 'Django' },
  { name: 'ExpressjsDark', label: 'Express', variant: 'dark' },
  { name: 'ExpressjsLight', label: 'Express', variant: 'light' },
  { name: 'FastAPI', label: 'FastAPI' },
  { name: 'FastifyDark', label: 'Fastify', variant: 'dark' },
  { name: 'FastifyLight', label: 'Fastify', variant: 'light' },
  { name: 'FlaskDark', label: 'Flask', variant: 'dark' },
  { name: 'FlaskLight', label: 'Flask', variant: 'light' },
  { name: 'Hono', label: 'Hono' },
  { name: 'Laravel', label: 'Laravel' },
  { name: 'NestJS', label: 'NestJS' },
  { name: 'Spring', label: 'Spring' },

  // Runtime Environments
  { name: 'Bun', label: 'Bun' },
  { name: 'DenoDark', label: 'Deno', variant: 'dark' },
  { name: 'DenoLight', label: 'Deno', variant: 'light' },
  { name: 'Nodejs', label: 'Node.js' },

  // Build Tools & Bundlers
  { name: 'Esbuild', label: 'Esbuild' },
  { name: 'Parcel', label: 'Parcel' },
  { name: 'Rolldown', label: 'Rolldown' },
  { name: 'Rsbuild', label: 'Rsbuild' },
  { name: 'Rspack', label: 'Rspack' },
  { name: 'SWC', label: 'SWC' },
  { name: 'TurbopackDark', label: 'Turbopack', variant: 'dark' },
  { name: 'TurbopackLight', label: 'Turbopack', variant: 'light' },
  { name: 'Vite', label: 'Vite' },

  // Package Managers
  { name: 'NPM', label: 'NPM' },
  { name: 'PnpmDark', label: 'PNPM', variant: 'dark' },
  { name: 'PnpmLight', label: 'PNPM', variant: 'light' },
  { name: 'Yarn', label: 'Yarn' },

  // Databases
  { name: 'MariaDB', label: 'MariaDB' },
  { name: 'MongoDBDark', label: 'MongoDB', variant: 'dark' },
  { name: 'MongoDBLight', label: 'MongoDB', variant: 'light' },
  { name: 'MySQLDark', label: 'MySQL', variant: 'dark' },
  { name: 'MySQLLight', label: 'MySQL', variant: 'light' },
  { name: 'PostgreSQL', label: 'PostgreSQL' },
  { name: 'Redis', label: 'Redis' },
  { name: 'SQLite', label: 'SQLite' },
  { name: 'Surrealdb', label: 'SurrealDB' },

  // Cloud & Infrastructure
  { name: 'AmazonWebServicesDark', label: 'AWS', variant: 'dark' },
  { name: 'AmazonWebServicesLight', label: 'AWS', variant: 'light' },
  { name: 'Cloudflare', label: 'Cloudflare' },
  { name: 'DigitalOcean', label: 'DigitalOcean' },
  { name: 'Docker', label: 'Docker' },
  { name: 'GoogleCloud', label: 'Google Cloud' },
  { name: 'Kubernetes', label: 'Kubernetes' },
  { name: 'MicrosoftAzure', label: 'Microsoft Azure' },
  { name: 'Nginx', label: 'Nginx' },
  { name: 'Terraform', label: 'Terraform' },
  { name: 'VercelDark', label: 'Vercel', variant: 'dark' },
  { name: 'VercelLight', label: 'Vercel', variant: 'light' },

  // Development Tools
  { name: 'Android', label: 'Android' },
  { name: 'Electron', label: 'Electron' },
  { name: 'ESLintDark', label: 'ESLint', variant: 'dark' },
  { name: 'ESLintLight', label: 'ESLint', variant: 'light' },
  { name: 'Figma', label: 'Figma' },
  { name: 'Firebase', label: 'Firebase' },
  { name: 'Flutter', label: 'Flutter' },
  { name: 'Git', label: 'Git' },
  { name: 'GitHubDark', label: 'GitHub', variant: 'dark' },
  { name: 'GitHubLight', label: 'GitHub', variant: 'light' },
  { name: 'GitLab', label: 'GitLab' },
  { name: 'GraphQL', label: 'GraphQL' },
  { name: 'Jest', label: 'Jest' },
  { name: 'JQueryDark', label: 'jQuery', variant: 'dark' },
  { name: 'JQueryLight', label: 'jQuery', variant: 'light' },
  { name: 'Playwright', label: 'Playwright' },
  { name: 'Postman', label: 'Postman' },
  { name: 'PrettierDark', label: 'Prettier', variant: 'dark' },
  { name: 'PrettierLight', label: 'Prettier', variant: 'light' },
  { name: 'Vitest', label: 'Vitest' },

  // UI Libraries
  { name: 'ChakraUI', label: 'Chakra UI' },
  { name: 'DaisyUI', label: 'DaisyUI' },
  { name: 'Mantine', label: 'Mantine' },
  { name: 'MaterialUI', label: 'Material UI' },
  { name: 'RadixUIDark', label: 'Radix UI', variant: 'dark' },
  { name: 'RadixUILight', label: 'Radix UI', variant: 'light' },
  { name: 'ShadcnUiDark', label: 'shadcn/ui', variant: 'dark' },
  { name: 'ShadcnUiLight', label: 'shadcn/ui', variant: 'light' },
  { name: 'TailwindCSS', label: 'Tailwind CSS' },

  // ORMs & Backend Tools
  { name: 'DrizzleORMDark', label: 'Drizzle ORM', variant: 'dark' },
  { name: 'DrizzleORMLight', label: 'Drizzle ORM', variant: 'light' },
  { name: 'PrismaDark', label: 'Prisma', variant: 'dark' },
  { name: 'PrismaLight', label: 'Prisma', variant: 'light' },
  { name: 'Supabase', label: 'Supabase' },
  { name: 'TRPC', label: 'tRPC' },

  // CMS & Platforms
  { name: 'Strapi', label: 'Strapi' },
  { name: 'WordPress', label: 'WordPress' },

  // Testing & Quality
  { name: 'Cypress', label: 'Cypress' },
  { name: 'Storybook', label: 'Storybook' },

  // Monorepo Tools
  { name: 'NxDark', label: 'Nx', variant: 'dark' },
  { name: 'NxLight', label: 'Nx', variant: 'light' },
  { name: 'TurborepoLight', label: 'Turborepo', variant: 'light' },
  { name: 'TurborepoDark', label: 'Turborepo', variant: 'dark' },

  // Microsoft Ecosystem
  { name: 'MicrosoftNET', label: '.NET' },
  { name: 'MicrosoftSQLServer', label: 'SQL Server' },

  // Other Popular Tools
  { name: 'Babel', label: 'Babel' },
  { name: 'BashDark', label: 'Bash', variant: 'dark' },
  { name: 'BashLight', label: 'Bash', variant: 'light' },
  { name: 'Linux', label: 'Linux' },
  { name: 'Sass', label: 'Sass' },
  { name: 'Ubuntu', label: 'Ubuntu' },
  { name: 'Vim', label: 'Vim' },
];

// Get the icon component dynamically from SVGL
export const getIconComponent = (iconName: string): SvglIconComponent | null => {
  if (!iconName) return null;

  // Try to get the component from SVGL exports
  const component = (SVGL as Record<string, unknown>)[iconName];

  if (component && typeof component === 'function') {
    return component as SvglIconComponent;
  }

  return null;
};

// Get icon options by search term
export const searchIcons = (searchTerm: string): IconOption[] => {
  if (!searchTerm) return AVAILABLE_ICONS;

  const lowerSearch = searchTerm.toLowerCase();
  return AVAILABLE_ICONS.filter(
    (icon) =>
      icon.label.toLowerCase().includes(lowerSearch) ||
      icon.name.toLowerCase().includes(lowerSearch)
  );
};
