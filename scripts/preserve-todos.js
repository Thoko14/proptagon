#!/usr/bin/env node

/**
 * Preserve TODOs Script
 * 
 * This script helps identify and preserve TODO items during refactoring
 * to prevent accidental deletion of important functionality.
 * 
 * Usage:
 *   node scripts/preserve-todos.js
 *   node scripts/preserve-todos.js --check
 *   node scripts/preserve-todos.js --list
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SEARCH_PATTERNS = [
  'TODO:',
  'FUTURE:',
  'NOT IMPLEMENTED',
  'MISSING',
  'PLACEHOLDER',
  'MOCK DATA',
  'PRESERVED:'
];

const IGNORE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'package-lock.json',
  'TODO_PRESERVATION_LIST.json'
];

const CRITICAL_FILES = [
  'modules/grow/frontend/GrowPage.tsx',
  'modules/grow/frontend/components/GrowViewManager.tsx',
  'modules/grow/frontend/hooks/useMapEvents.ts',
  'modules/grow/backend/data/fetch.py',
  'modules/grow/backend/scoring/logic/scoring_algorithms.py'
];

function findTodosInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const todos = [];

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      SEARCH_PATTERNS.forEach(pattern => {
        if (line.includes(pattern)) {
          todos.push({
            file: filePath,
            line: lineNumber,
            pattern,
            content: line.trim()
          });
        }
      });
    });

    return todos;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function shouldIgnoreFile(filePath) {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function findTodosInDirectory(dirPath) {
  const todos = [];

  function traverse(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const relativePath = path.relative(process.cwd(), fullPath);
        
        if (shouldIgnoreFile(relativePath)) {
          return;
        }

        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (stat.isFile()) {
          const fileTodos = findTodosInFile(relativePath);
          todos.push(...fileTodos);
        }
      });
    } catch (error) {
      console.error(`Error traversing directory ${currentPath}:`, error.message);
    }
  }

  traverse(dirPath);
  return todos;
}

function categorizeTodos(todos) {
  const categories = {
    'High Priority': [],
    'Medium Priority': [],
    'Low Priority': [],
    'Critical Files': []
  };

  todos.forEach(todo => {
    // Check if it's in a critical file
    if (CRITICAL_FILES.some(criticalFile => todo.file.includes(criticalFile))) {
      categories['Critical Files'].push(todo);
    }
    // Categorize by pattern and content
    else if (todo.pattern === 'TODO:' && todo.content.includes('Implement')) {
      categories['High Priority'].push(todo);
    }
    else if (todo.pattern === 'FUTURE:' || todo.pattern === 'NOT IMPLEMENTED') {
      categories['Medium Priority'].push(todo);
    }
    else {
      categories['Low Priority'].push(todo);
    }
  });

  return categories;
}

function printTodoReport(categories) {
  console.log('\n🔍 TODO Preservation Report\n');
  console.log('=' .repeat(50));

  Object.entries(categories).forEach(([category, todos]) => {
    if (todos.length === 0) return;

    console.log(`\n📋 ${category} (${todos.length} items):`);
    console.log('-'.repeat(30));

    todos.forEach(todo => {
      console.log(`  ${todo.file}:${todo.line}`);
      console.log(`    ${todo.content}`);
      console.log('');
    });
  });

  const totalTodos = Object.values(categories).flat().length;
  console.log(`\n📊 Total TODOs found: ${totalTodos}`);
}

function checkForDeletedTodos() {
  console.log('🔍 Checking for potentially deleted TODOs...');
  
  // This would require git history analysis
  // For now, just provide a warning
  console.log('⚠️  Warning: Always check git history before removing TODO items');
  console.log('💡 Use: git log -S "TODO:" --oneline');
}

function generatePreservationList() {
  const todos = findTodosInDirectory('.');
  const categories = categorizeTodos(todos);
  
  const preservationList = {
    timestamp: new Date().toISOString(),
    totalCount: Object.values(categories).flat().length,
    categories: {}
  };

  Object.entries(categories).forEach(([category, items]) => {
    preservationList.categories[category] = items.map(item => ({
      file: item.file,
      line: item.line,
      pattern: item.pattern,
      content: item.content
    }));
  });

  const outputPath = 'data/docs/TODO_PRESERVATION_LIST.json';
  fs.writeFileSync(outputPath, JSON.stringify(preservationList, null, 2));
  
  console.log(`✅ Preservation list saved to: ${outputPath}`);
  return preservationList;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🛡️  TODO Preservation Tool');
  console.log('========================');

  switch (command) {
    case '--check':
      checkForDeletedTodos();
      break;
      
    case '--list':
      const todos = findTodosInDirectory('.');
      const categories = categorizeTodos(todos);
      printTodoReport(categories);
      break;
      
    case '--generate':
      generatePreservationList();
      break;
      
    default:
      console.log('\nUsage:');
      console.log('  node scripts/preserve-todos.js --check    # Check for deleted TODOs');
      console.log('  node scripts/preserve-todos.js --list     # List all TODOs');
      console.log('  node scripts/preserve-todos.js --generate # Generate preservation list');
      console.log('\nPreservation Guidelines:');
      console.log('  ✅ DO NOT DELETE: Functions marked with TODO: Implement');
      console.log('  ✅ DO NOT DELETE: Components with placeholder implementations');
      console.log('  ✅ DO NOT DELETE: Hooks with incomplete functionality');
      console.log('  ✅ DO NOT DELETE: API endpoints returning mock data');
      console.log('  ❌ SAFE TO REMOVE: Only unused imports and variables');
      console.log('  ❌ SAFE TO REMOVE: Only duplicate implementations');
      console.log('  ❌ SAFE TO REMOVE: Only dead code without TODO markers');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  findTodosInFile,
  findTodosInDirectory,
  categorizeTodos,
  generatePreservationList
}; 