const fs = require("fs");
const path = require("path");

const sourceDir = "C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\e8580d11-6487-4c9a-b224-dabe1c52c5e3";
const targetDocsDir = "d:\\surokkha-bd\\docs\\images";
const targetGuidesDir = path.join(targetDocsDir, "hazard_guides");

if (!fs.existsSync(targetDocsDir)) fs.mkdirSync(targetDocsDir, { recursive: true });
if (!fs.existsSync(targetGuidesDir)) fs.mkdirSync(targetGuidesDir, { recursive: true });

// Copy root PNG and WebM files
const rootFiles = fs.readdirSync(sourceDir);
let copiedCount = 0;

for (const file of rootFiles) {
  if (file.endsWith(".png") || file.endsWith(".webm") || file.endsWith(".jpg")) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(targetDocsDir, file);
    fs.copyFileSync(srcPath, destPath);
    copiedCount++;
  }
}

// Copy hazard guides screenshots
const sourceGuidesDir = path.join(sourceDir, "hazard_guides");
if (fs.existsSync(sourceGuidesDir)) {
  const guideFiles = fs.readdirSync(sourceGuidesDir);
  for (const file of guideFiles) {
    if (file.endsWith(".png")) {
      const srcPath = path.join(sourceGuidesDir, file);
      const destPath = path.join(targetGuidesDir, file);
      fs.copyFileSync(srcPath, destPath);
      copiedCount++;
    }
  }
}

console.log(`Successfully saved ${copiedCount} media files to ${targetDocsDir}!`);

// Verify files
const docsList = fs.readdirSync(targetDocsDir);
console.log(`Root docs/images contains ${docsList.length} items`);
const guidesList = fs.readdirSync(targetGuidesDir);
console.log(`docs/images/hazard_guides contains ${guidesList.length} items`);
