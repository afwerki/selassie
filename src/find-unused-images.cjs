const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "assets");
const srcDir = __dirname;
const backupDir = path.join(__dirname, "unused-media-backup");

const MEDIA_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".gif",
  ".mp4",
  ".mov",
  ".avi",
  ".m4v",
  ".webm",
];

const SOURCE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".css", ".scss"];

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

function getAllFiles(dir, extensions = []) {
  if (!fs.existsSync(dir)) return [];

  let results = [];

  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    try {
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(fullPath, extensions));
      } else if (
        extensions.length === 0 ||
        extensions.includes(path.extname(file).toLowerCase())
      ) {
        results.push(fullPath);
      }
    } catch (err) {
      console.warn(`⚠️ Skipped: ${fullPath}`);
    }
  });

  return results;
}

function readAllSourceContent(files) {
  return files
    .map((file) => {
      try {
        return fs.readFileSync(file, "utf8");
      } catch {
        return "";
      }
    })
    .join("\n");
}

function isUsed(filePath, usedContent) {
  const fileName = path.basename(filePath);
  const relativeFromSrc = path
    .relative(srcDir, filePath)
    .replace(/\\/g, "/");

  const relativeFromAssets = path
    .relative(assetsDir, filePath)
    .replace(/\\/g, "/");

  return (
    usedContent.includes(fileName) ||
    usedContent.includes(relativeFromSrc) ||
    usedContent.includes(relativeFromAssets)
  );
}

function moveToBackup(filePath) {
  const relativePath = path.relative(assetsDir, filePath);
  const destinationPath = path.join(backupDir, relativePath);
  const destinationDir = path.dirname(destinationPath);

  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  fs.renameSync(filePath, destinationPath);
}

const mediaFiles = getAllFiles(assetsDir, MEDIA_EXTENSIONS);
const sourceFiles = getAllFiles(srcDir, SOURCE_EXTENSIONS);
const usedContent = readAllSourceContent(sourceFiles);

const unusedMedia = mediaFiles.filter((filePath) => !isUsed(filePath, usedContent));

const unusedImages = unusedMedia.filter((file) =>
  [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(
    path.extname(file).toLowerCase()
  )
);

const unusedVideos = unusedMedia.filter((file) =>
  [".mp4", ".mov", ".avi", ".m4v", ".webm"].includes(
    path.extname(file).toLowerCase()
  )
);

console.log("\n🧹 Unused Images:\n");
unusedImages.forEach((file) => console.log(file));

console.log("\n🎬 Unused Videos:\n");
unusedVideos.forEach((file) => console.log(file));

console.log(`\nTotal unused images: ${unusedImages.length}`);
console.log(`Total unused videos: ${unusedVideos.length}`);
console.log(`Total unused media: ${unusedMedia.length}`);

if (unusedMedia.length === 0) {
  console.log("\n✅ No unused media found.");
  process.exit(0);
}

console.log("\n📦 Moving unused media to backup...\n");

unusedMedia.forEach((filePath) => {
  try {
    moveToBackup(filePath);
    console.log(`✅ Moved: ${filePath}`);
  } catch (err) {
    console.error(`❌ Failed: ${filePath}`, err.message);
  }
});

console.log(`\n🎉 Done! Unused media moved to: ${backupDir}`);