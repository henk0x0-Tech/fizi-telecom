import fs from 'fs';

// Read backend controllers
const productsContent = fs.readFileSync('./backend/controllers/productController.js', 'utf8');
const servicesContent = fs.readFileSync('./backend/controllers/serviceController.js', 'utf8');

// Extract arrays using regex
function extractArray(content, varName) {
  const match = content.match(new RegExp(`const ${varName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`));
  if (match) {
    return match[1];
  }
  return '[]';
}

const productsArr = extractArray(productsContent, 'defaultProducts');
const servicesArr = extractArray(servicesContent, 'defaultServices');

const fallbackContent = `export const defaultProducts = ${productsArr};

export const defaultServices = ${servicesArr};
`;

fs.writeFileSync('./frontend/src/fallbackData.js', fallbackContent);
console.log('Successfully synced fallbackData.js');
