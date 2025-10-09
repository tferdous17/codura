import * as icons from 'lucide-react';

console.log('Search exists:', 'Search' in icons);
console.log('Filter exists:', 'Filter' in icons);
console.log('Total exports:', Object.keys(icons).length);

// Find magnifying glass type icons
const searchIcons = Object.keys(icons).filter(k =>
  k.toLowerCase().includes('search') || k.toLowerCase().includes('find')
);
console.log('\nSearch-related icons:', searchIcons.slice(0, 20).join(', '));
