const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "assets/images");
const srcDir = __dirname;
const backupDir = path.join(__dirname, "unused-images-backup");

// Ensure backup folder exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

function getAllFiles(dir, extensions = []) {
  let results = [];

  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    try {
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(fullPath, extensions));
      } else {
        if (
          extensions.length === 0 ||
          extensions.includes(path.extname(file).toLowerCase())
        ) {
          results.push(fullPath);
        }
      }
    } catch (err) {
      console.warn(`⚠️ Skipped: ${fullPath}`);
    }
  });

  return results;
}

// Get all images
const images = getAllFiles(imagesDir, [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
]);

// Get all source files
const sourceFiles = getAllFiles(srcDir, [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
]);

// Read all code content
const usedContent = sourceFiles
  .map((file) => {
    try {
      return fs.readFileSync(file, "utf8");
    } catch {
      return "";
    }
  })
  .join("\n");

// Find unused images
const unusedImages = images.filter((imgPath) => {
  const fileName = path.basename(imgPath);
  return !usedContent.includes(fileName);
});

// Log results
console.log("\n🧹 Unused Images:\n");
unusedImages.forEach((img) => console.log(img));

console.log(`\nTotal unused: ${unusedImages.length}`);

// Move unused images to backup
console.log("\n📦 Moving unused images...\n");

unusedImages.forEach((imgPath) => {
  const fileName = path.basename(imgPath);
  const newPath = path.join(backupDir, fileName);

  try {
    fs.renameSync(imgPath, newPath);
    console.log(`✅ Moved: ${fileName}`);
  } catch (err) {
    console.error(`❌ Failed: ${fileName}`, err.message);
  }
});

console.log(`\n🎉 Done! Images moved to: ${backupDir}`);