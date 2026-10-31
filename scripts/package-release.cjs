'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const OUTPUT_ZIP = path.join(DIST_DIR, 'insom-agy-wall-project.zip');

function toDosDateTime(date) {
  const d = (date instanceof Date && !isNaN(date.getTime())) ? date : new Date();
  const year = d.getFullYear() >= 1980 ? d.getFullYear() - 1980 : 0;
  const dosDate = (year << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const dosTime = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  return { dosDate, dosTime };
}

function buildZip(entries, outputPath) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const entry of entries) {
    const isDir = Boolean(entry.isDirectory);
    let data = Buffer.alloc(0);
    let mtime = new Date();
    if (!isDir) {
      data = fs.readFileSync(entry.sourcePath);
      const stat = fs.statSync(entry.sourcePath);
      mtime = stat.mtime;
    } else if (entry.sourcePath && fs.existsSync(entry.sourcePath)) {
      mtime = fs.statSync(entry.sourcePath).mtime;
    }
    const { dosDate, dosTime } = toDosDateTime(mtime);

    const compressed = isDir ? Buffer.alloc(0) : zlib.deflateRawSync(data);
    const useDeflate = !isDir && compressed.length < data.length;
    const compData = isDir ? Buffer.alloc(0) : (useDeflate ? compressed : data);
    const compMethod = isDir ? 0 : (useDeflate ? 8 : 0);
    const crc = isDir ? 0 : zlib.crc32(data);
    let zipPath = entry.zipPath.replace(/\\/g, '/');
    if (isDir && !zipPath.endsWith('/')) zipPath += '/';
    const nameBuf = Buffer.from(zipPath, 'utf8');

    // Local file header (30 bytes + name length)
    const local = Buffer.alloc(30 + nameBuf.length);
    local.writeUInt32LE(0x04034b50, 0);       // Signature
    local.writeUInt16LE(20, 4);               // Version needed (2.0)
    local.writeUInt16LE(0, 6);                // Flags
    local.writeUInt16LE(compMethod, 8);       // Compression method
    local.writeUInt16LE(dosTime, 10);         // Last mod time
    local.writeUInt16LE(dosDate, 12);         // Last mod date
    local.writeUInt32LE(crc, 14);             // CRC-32
    local.writeUInt32LE(compData.length, 18); // Compressed size
    local.writeUInt32LE(data.length, 22);     // Uncompressed size
    local.writeUInt16LE(nameBuf.length, 26);  // File name length
    local.writeUInt16LE(0, 28);               // Extra field length
    nameBuf.copy(local, 30);

    const localOffset = offset;
    localHeaders.push(local);
    if (!isDir) {
      localHeaders.push(compData);
    }
    offset += local.length + compData.length;

    // Central directory header (46 bytes + name length)
    const central = Buffer.alloc(46 + nameBuf.length);
    central.writeUInt32LE(0x02014b50, 0);     // Signature
    central.writeUInt16LE(0x0314, 4);         // Version made by (UNIX 3.0, PKZIP 2.0)
    central.writeUInt16LE(20, 6);             // Version needed
    central.writeUInt16LE(0, 8);              // Flags
    central.writeUInt16LE(compMethod, 10);    // Compression method
    central.writeUInt16LE(dosTime, 12);       // Last mod time
    central.writeUInt16LE(dosDate, 14);       // Last mod date
    central.writeUInt32LE(crc, 16);           // CRC-32
    central.writeUInt32LE(compData.length, 20);// Compressed size
    central.writeUInt32LE(data.length, 24);   // Uncompressed size
    central.writeUInt16LE(nameBuf.length, 28);// File name length
    central.writeUInt16LE(0, 30);             // Extra field length
    central.writeUInt16LE(0, 32);             // File comment length
    central.writeUInt16LE(0, 34);             // Disk number start
    central.writeUInt16LE(0, 36);             // Internal file attributes
    // External file attributes: Unix permissions in upper 16 bits
    const mode = isDir ? 0o040755 : (entry.isExecutable ? 0o100755 : 0o100644);
    const attr = isDir ? ((mode << 16) | 0x10) >>> 0 : ((mode << 16) | 0x20) >>> 0;
    central.writeUInt32LE(attr, 38);
    central.writeUInt32LE(localOffset, 42);   // Relative offset of local header
    nameBuf.copy(central, 46);

    centralHeaders.push(central);
  }

  const centralOffset = offset;
  const centralSize = centralHeaders.reduce((sum, h) => sum + h.length, 0);

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);          // Signature
  eocd.writeUInt16LE(0, 4);                   // Disk number
  eocd.writeUInt16LE(0, 6);                   // Start disk number
  eocd.writeUInt16LE(entries.length, 8);      // Entries on this disk
  eocd.writeUInt16LE(entries.length, 10);     // Total entries
  eocd.writeUInt32LE(centralSize, 12);        // Central directory size
  eocd.writeUInt32LE(centralOffset, 16);      // Central directory offset
  eocd.writeUInt16LE(0, 20);                  // ZIP file comment length

  const zipBuffer = Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
  fs.writeFileSync(outputPath, zipBuffer);
  return zipBuffer.length;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const rootFiles = [
    'manage-wallpapers.cjs',
    'ascii-wallpapers.js',
    'wallpaper-scenes.js',
    'wallpapers-main.js',
    'install.bat',
    'uninstall.bat',
    'install.ps1',
    'uninstall.ps1',
    'install.sh',
    'uninstall.sh',
    'package.json',
    'README.md',
    'LICENSE',
    'index.html'
  ];

  const entries = [];

  for (const file of rootFiles) {
    const fullPath = path.join(ROOT_DIR, file);
    if (fs.existsSync(fullPath)) {
      entries.push({
        sourcePath: fullPath,
        zipPath: file,
        isExecutable: file.endsWith('.sh')
      });
    }
  }

  // Include scripts directory
  const scriptsDir = path.join(ROOT_DIR, 'scripts');
  if (fs.existsSync(scriptsDir)) {
    entries.push({
      sourcePath: scriptsDir,
      zipPath: 'scripts/',
      isDirectory: true
    });
    const scriptFiles = fs.readdirSync(scriptsDir);
    for (const sf of scriptFiles) {
      const fullPath = path.join(scriptsDir, sf);
      if (fs.statSync(fullPath).isFile()) {
        entries.push({
          sourcePath: fullPath,
          zipPath: 'scripts/' + sf,
          isExecutable: sf.endsWith('.sh')
        });
      }
    }
  }

  // Include image assets, excluding large demo video (~9.4 MB)
  const assetsDir = path.join(ROOT_DIR, 'assets');
  if (fs.existsSync(assetsDir)) {
    entries.push({
      sourcePath: assetsDir,
      zipPath: 'assets/',
      isDirectory: true
    });
    const assetFiles = fs.readdirSync(assetsDir);
    for (const af of assetFiles) {
      if (af.endsWith('.mp4')) {
        continue; // Exclude demo video to keep release lightweight
      }
      const fullPath = path.join(assetsDir, af);
      if (fs.statSync(fullPath).isFile()) {
        entries.push({
          sourcePath: fullPath,
          zipPath: 'assets/' + af,
          isExecutable: false
        });
      }
    }
  }

  console.log(`[Insom Agy Wall] Packaging ${entries.length} files into ${path.relative(ROOT_DIR, OUTPUT_ZIP)}...`);
  const totalBytes = buildZip(entries, OUTPUT_ZIP);
  const sizeKb = (totalBytes / 1024).toFixed(1);
  console.log(`[Insom Agy Wall] Release package created: ${path.relative(ROOT_DIR, OUTPUT_ZIP)} (${totalBytes} bytes, ~${sizeKb} KB)`);
}

main();
