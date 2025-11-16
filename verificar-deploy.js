#!/usr/bin/env node

// Script de verificación pre-deploy
console.log('🔍 Verificando configuración para deploy en Render...\n');

const fs = require('fs');
const path = require('path');

let errores = 0;
let advertencias = 0;

function verificar(condicion, mensaje, esAdvertencia = false) {
  if (condicion) {
    console.log(`✅ ${mensaje}`);
  } else {
    if (esAdvertencia) {
      console.log(`⚠️  ${mensaje}`);
      advertencias++;
    } else {
      console.log(`❌ ${mensaje}`);
      errores++;
    }
  }
}

console.log('📦 Backend:\n');

// Verificar estructura del backend
const backPath = path.join(__dirname, 'back');
verificar(fs.existsSync(backPath), 'Directorio back/ existe');
verificar(fs.existsSync(path.join(backPath, 'package.json')), 'back/package.json existe');
verificar(fs.existsSync(path.join(backPath, 'src', 'server.js')), 'back/src/server.js existe');
verificar(fs.existsSync(path.join(backPath, '.env.example')), 'back/.env.example existe');
verificar(fs.existsSync(path.join(backPath, 'render.yaml')), 'back/render.yaml existe');
verificar(fs.existsSync(path.join(backPath, '.gitignore')), 'back/.gitignore existe');

// Verificar .env
const envExists = fs.existsSync(path.join(backPath, '.env'));
verificar(envExists, '.env existe (solo para desarrollo local)', true);

// Verificar package.json del backend
try {
  const backPackage = require('./back/package.json');
  verificar(backPackage.type === 'module', 'package.json tiene "type": "module"');
  verificar(backPackage.scripts.start, 'Script "start" está definido');
  verificar(backPackage.dependencies['@supabase/supabase-js'], 'Dependencia @supabase/supabase-js instalada');
  verificar(backPackage.dependencies.express, 'Dependencia express instalada');
  verificar(backPackage.dependencies.cors, 'Dependencia cors instalada');
} catch (e) {
  console.log(`❌ Error leyendo back/package.json: ${e.message}`);
  errores++;
}

console.log('\n🎨 Frontend:\n');

// Verificar estructura del frontend
const frontPath = path.join(__dirname, 'front');
verificar(fs.existsSync(frontPath), 'Directorio front/ existe');
verificar(fs.existsSync(path.join(frontPath, 'package.json')), 'front/package.json existe');
verificar(fs.existsSync(path.join(frontPath, 'src', 'environments', 'environment.prod.ts')), 'environment.prod.ts existe');
verificar(fs.existsSync(path.join(frontPath, 'angular.json')), 'angular.json existe');

// Verificar package.json del frontend
try {
  const frontPackage = require('./front/package.json');
  verificar(frontPackage.scripts.build, 'Script "build" está definido');
  verificar(frontPackage.dependencies['@angular/core'], 'Angular instalado');
} catch (e) {
  console.log(`❌ Error leyendo front/package.json: ${e.message}`);
  errores++;
}

// Verificar environment.prod.ts
try {
  const envProdContent = fs.readFileSync(path.join(frontPath, 'src', 'environments', 'environment.prod.ts'), 'utf8');
  verificar(
    envProdContent.includes('production: true'),
    'environment.prod.ts tiene production: true'
  );
  verificar(
    !envProdContent.includes('localhost'),
    'environment.prod.ts NO usa localhost (actualiza con URL de Render)',
    true
  );
} catch (e) {
  console.log(`❌ Error leyendo environment.prod.ts: ${e.message}`);
  errores++;
}

console.log('\n📋 Archivos de configuración:\n');

verificar(fs.existsSync(path.join(__dirname, 'DEPLOY.md')), 'DEPLOY.md existe');
verificar(fs.existsSync(path.join(__dirname, 'CHECKLIST_DEPLOY.md')), 'CHECKLIST_DEPLOY.md existe');

console.log('\n📊 Resumen:\n');
console.log(`   Errores: ${errores}`);
console.log(`   Advertencias: ${advertencias}\n`);

if (errores > 0) {
  console.log('❌ Hay errores que deben corregirse antes del deploy');
  process.exit(1);
} else if (advertencias > 0) {
  console.log('⚠️  Hay advertencias. Revisa antes de hacer deploy.');
  process.exit(0);
} else {
  console.log('✅ Todo listo para deploy en Render!');
  console.log('\n📚 Próximos pasos:');
  console.log('   1. Commit y push a GitHub');
  console.log('   2. Sigue las instrucciones en CHECKLIST_DEPLOY.md');
  console.log('   3. Crea los servicios en Render');
  process.exit(0);
}
