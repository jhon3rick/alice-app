/**
 * Available Dev Icons
 *
 * List of available technology icons from Simple Icons library.
 * Used across the application for consistent icon selection and rendering.
 */

import * as SimpleIcons from 'react-icons/si';

export interface IconOption {
  name: string;
  label: string;
}

// List of available Simple Icons with their base names
// Note: Icon names must match Simple Icons format (e.g., 'amazonwebservices', 'nodedotjs', etc.)
export const AVAILABLE_ICONS: IconOption[] = [
  { name: 'amazonwebservices', label: 'AWS' },
  { name: 'android', label: 'Android' },
  { name: 'angular', label: 'Angular' },
  { name: 'ansible', label: 'Ansible' },
  { name: 'apache', label: 'Apache' },
  { name: 'apachekafka', label: 'Apache Kafka' },
  { name: 'apple', label: 'Apple' },
  { name: 'babel', label: 'Babel' },
  { name: 'bootstrap', label: 'Bootstrap' },
  { name: 'c', label: 'C' },
  { name: 'cplusplus', label: 'C++' },
  { name: 'css3', label: 'CSS3' },
  { name: 'dart', label: 'Dart' },
  { name: 'debian', label: 'Debian' },
  { name: 'django', label: 'Django' },
  { name: 'docker', label: 'Docker' },
  { name: 'electron', label: 'Electron' },
  { name: 'express', label: 'Express' },
  { name: 'figma', label: 'Figma' },
  { name: 'firebase', label: 'Firebase' },
  { name: 'flutter', label: 'Flutter' },
  { name: 'gatsby', label: 'Gatsby' },
  { name: 'git', label: 'Git' },
  { name: 'github', label: 'GitHub' },
  { name: 'gitlab', label: 'GitLab' },
  { name: 'gnubash', label: 'Bash' },
  { name: 'go', label: 'Go' },
  { name: 'graphql', label: 'GraphQL' },
  { name: 'html5', label: 'HTML5' },
  { name: 'javascript', label: 'JavaScript' },
  { name: 'jenkins', label: 'Jenkins' },
  { name: 'jest', label: 'Jest' },
  { name: 'jquery', label: 'jQuery' },
  { name: 'kotlin', label: 'Kotlin' },
  { name: 'kubernetes', label: 'Kubernetes' },
  { name: 'laravel', label: 'Laravel' },
  { name: 'linux', label: 'Linux' },
  { name: 'mongodb', label: 'MongoDB' },
  { name: 'mysql', label: 'MySQL' },
  { name: 'nestjs', label: 'NestJS' },
  { name: 'nextdotjs', label: 'Next.js' },
  { name: 'nginx', label: 'Nginx' },
  { name: 'nodedotjs', label: 'Node.js' },
  { name: 'npm', label: 'NPM' },
  { name: 'nuxtdotjs', label: 'Nuxt.js' },
  { name: 'php', label: 'PHP' },
  { name: 'postgresql', label: 'PostgreSQL' },
  { name: 'python', label: 'Python' },
  { name: 'react', label: 'React' },
  { name: 'redis', label: 'Redis' },
  { name: 'redux', label: 'Redux' },
  { name: 'ruby', label: 'Ruby' },
  { name: 'rust', label: 'Rust' },
  { name: 'sass', label: 'Sass' },
  { name: 'spring', label: 'Spring' },
  { name: 'sqlite', label: 'SQLite' },
  { name: 'svelte', label: 'Svelte' },
  { name: 'swift', label: 'Swift' },
  { name: 'tailwindcss', label: 'Tailwind CSS' },
  { name: 'typescript', label: 'TypeScript' },
  { name: 'ubuntu', label: 'Ubuntu' },
  { name: 'vim', label: 'Vim' },
  { name: 'vuedotjs', label: 'Vue.js' },
  { name: 'webpack', label: 'Webpack' },
  { name: 'wordpress', label: 'WordPress' },
  { name: 'yarn', label: 'Yarn' },
];

// Get the icon component dynamically
export const getIconComponent = (iconName: string) => {
  if (!iconName) return null;
  // Format for react-icons Simple Icons (e.g., 'laravel' -> 'SiLaravel')
  const capitalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const componentName = `Si${capitalizedName}` as keyof typeof SimpleIcons;
  return SimpleIcons[componentName];
};
