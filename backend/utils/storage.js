/**
 * JSON File Storage Utility
 * Simple file-based persistence for projects, users, and artifacts
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readData(collection) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeData(collection, data) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readArtifact(projectId, agentId) {
  const artifactDir = path.join(DATA_DIR, 'artifacts', projectId);
  const filePath = path.join(artifactDir, `${agentId}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeArtifact(projectId, agentId, data) {
  const artifactDir = path.join(DATA_DIR, 'artifacts', projectId);
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }
  const filePath = path.join(artifactDir, `${agentId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function getProjectArtifacts(projectId) {
  const artifactDir = path.join(DATA_DIR, 'artifacts', projectId);
  if (!fs.existsSync(artifactDir)) return {};
  
  const artifacts = {};
  const files = fs.readdirSync(artifactDir);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const agentId = file.replace('.json', '');
      try {
        artifacts[agentId] = JSON.parse(fs.readFileSync(path.join(artifactDir, file), 'utf8'));
      } catch { /* skip corrupted files */ }
    }
  }
  return artifacts;
}

module.exports = { readData, writeData, readArtifact, writeArtifact, getProjectArtifacts };
