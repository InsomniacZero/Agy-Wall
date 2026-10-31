process.noAsar = true;
/* Usage: node manage-wallpapers.cjs install|restore|verify [--force] [--asar <path>] [--print-path] */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const child_process = require('child_process');

const log = (...args) => console.log('[Insom Agy Wall]', ...args);
const error = (...args) => console.error('[Insom Agy Wall]', ...args);

const SUPPORTED_HASHES = [
  '046fa2ba9abe96bc915eb7ed12887c067396a8a12148842ab4f4e2cd05a68feb', // Windows 2.28.2
  'bd10a0054ca3ad469142b2c2757566493ecc0afb934b9a61ce45d38a4d09316e'  // Linux 2.24.0
];

function sha(b) {
  return crypto.createHash('sha256').update(b).digest('hex');
}

function checkAppImageMount(filePath) {
  if (filePath && (filePath.includes('/.mount_') || filePath.startsWith('/tmp/.mount'))) {
    throw Error(
      'Antigravity is located in a temporary AppImage FUSE mount:\n' +
      '  ' + filePath + '\n' +
      'Modifications to a temporary FUSE mount are ephemeral and read-only.\n' +
      'To use ASCII Wallpapers with an AppImage:\n' +
      '  1. Extract the AppImage:\n' +
      '     ./Antigravity.AppImage --appimage-extract\n' +
      '  2. Install using the extracted squashfs-root:\n' +
      '     node manage-wallpapers.cjs install --asar squashfs-root/resources/app.asar\n' +
      '  3. Launch the extracted application:\n' +
      '     ./squashfs-root/AppRun'
    );
  }
}

function normalizeAsarPath(inputPath) {
  if (!inputPath) return null;
  const resolved = path.resolve(inputPath);
  if (fs.existsSync(resolved)) {
    const stat = fs.statSync(resolved);
    if (stat.isDirectory()) {
      const candidate1 = path.join(resolved, 'resources', 'app.asar');
      if (fs.existsSync(candidate1)) return candidate1;
      const candidate2 = path.join(resolved, 'app.asar');
      if (fs.existsSync(candidate2)) return candidate2;
    }
  }
  return resolved;
}

function findRunningAsar() {
  if (process.platform === 'linux') {
    try {
      const pids = fs.readdirSync('/proc').filter(n => /^\d+$/.test(n));
      for (const pid of pids) {
        if (Number(pid) === process.pid) continue;
        try {
          const exe = fs.readlinkSync('/proc/' + pid + '/exe');
          const base = path.basename(exe).toLowerCase();
          if (base === 'antigravity' || base.startsWith('antigravity')) {
            const cmdline = fs.readFileSync('/proc/' + pid + '/cmdline', 'utf8');
            const m = cmdline.match(/--app-path=([^\0]+)/);
            if (m && fs.existsSync(m[1])) return path.resolve(m[1]);
            const candidate = path.join(path.dirname(exe), 'resources', 'app.asar');
            if (fs.existsSync(candidate)) return path.resolve(candidate);
          }
        } catch (_) {}
      }
    } catch (_) {}
  } else if (process.platform === 'win32') {
    try {
      const cmd = 'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "(Get-Process -Name antigravity -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Path -First 1)"';
      const exePath = child_process.execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      if (exePath && fs.existsSync(exePath)) {
        const candidate = path.join(path.dirname(exePath), 'resources', 'app.asar');
        if (fs.existsSync(candidate)) return path.resolve(candidate);
      }
    } catch (_) {}
  }
  return null;
}

function resolveArchive(customPath) {
  if (customPath) {
    const normalized = normalizeAsarPath(customPath);
    checkAppImageMount(normalized);
    return normalized;
  }

  if (process.env.ANTIGRAVITY_APP_ASAR) {
    const normalized = normalizeAsarPath(process.env.ANTIGRAVITY_APP_ASAR);
    checkAppImageMount(normalized);
    if (fs.existsSync(normalized)) {
      return normalized;
    }
  }

  const runningAsar = findRunningAsar();
  if (runningAsar && fs.existsSync(runningAsar)) {
    checkAppImageMount(runningAsar);
    return runningAsar;
  }

  const candidates = [];
  if (process.platform === 'win32') {
    candidates.push(
      path.join(process.env.LOCALAPPDATA || '', 'Programs', 'antigravity', 'resources', 'app.asar'),
      path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Antigravity', 'resources', 'app.asar'),
      path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Antigravity', 'resources', 'app.asar'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Antigravity', 'resources', 'app.asar'),
      path.join(process.env.APPDATA || '', 'Programs', 'antigravity', 'resources', 'app.asar')
    );
  } else {
    candidates.push(
      path.join(process.env.HOME || '', 'Apps', 'Antigravity-x64', 'resources', 'app.asar'),
      path.join(process.env.HOME || '', 'Apps', 'Antigravity', 'resources', 'app.asar'),
      '/home/insomniac/Apps/Antigravity-x64/resources/app.asar',
      path.join(process.env.HOME || '', '.local', 'share', 'antigravity', 'resources', 'app.asar'),
      '/opt/Antigravity/resources/app.asar',
      '/opt/antigravity/resources/app.asar',
      '/usr/lib/antigravity/resources/app.asar',
      '/usr/share/antigravity/resources/app.asar',
      path.join(process.env.HOME || '', '.var', 'app', 'com.google.Antigravity', 'data', 'antigravity', 'resources', 'app.asar')
    );
  }

  for (const c of candidates) {
    if (c && fs.existsSync(c)) {
      checkAppImageMount(c);
      return path.resolve(c);
    }
  }

  // Fallback default
  const defaultPath = process.platform === 'win32'
    ? path.join(process.env.LOCALAPPDATA || '', 'Programs', 'antigravity', 'resources', 'app.asar')
    : path.join(process.env.HOME || '', '.local', 'share', 'antigravity', 'resources', 'app.asar');
  checkAppImageMount(defaultPath);
  return defaultPath;
}

function parse(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 16) throw Error('Invalid ASAR archive: file too short');
  if (bytes.readUInt32LE(0) !== 4) throw Error('Unexpected ASAR format');
  const dataStart = 8 + bytes.readUInt32LE(4);
  const header = JSON.parse(bytes.subarray(16, 16 + bytes.readUInt32LE(12)).toString('utf8'));
  return { header, dataStart };
}

function extractVersion(original) {
  try {
    const { header, dataStart } = parse(original);
    const pkgItem = header.files && header.files['package.json'];
    if (pkgItem && !pkgItem.files) {
      const pkgStr = original.subarray(dataStart + Number(pkgItem.offset), dataStart + Number(pkgItem.offset) + pkgItem.size).toString('utf8');
      const pkg = JSON.parse(pkgStr);
      if (pkg.version) return pkg.version;
    }
  } catch (_) {}
  const digest = sha(original);
  if (digest === 'bd10a0054ca3ad469142b2c2757566493ecc0afb934b9a61ce45d38a4d09316e') return '2.24.0';
  if (digest === '046fa2ba9abe96bc915eb7ed12887c067396a8a12148842ab4f4e2cd05a68feb') return '2.28.2';
  return 'unknown';
}

function repack(original, script, mainScript) {
  const { header, dataStart } = parse(original);
  const chunks = [];
  let offset = 0;

  function walk(tree, prefix = '') {
    for (const [name, item] of Object.entries(tree.files || {})) {
      const p = prefix ? prefix + '/' + name : name;
      if (item.files) {
        walk(item, p);
        continue;
      }
      if (item.unpacked || item.link) continue;
      let content = original.subarray(dataStart + Number(item.offset), dataStart + Number(item.offset) + item.size);
      if (p === 'dist/preload.js' || p === 'dist/main.js') {
        const marker = '// BEGIN LOCAL ASCII WALLPAPERS';
        const markerIndex = content.indexOf(Buffer.from(marker));
        if (markerIndex !== -1) {
          let stripEnd = markerIndex;
          while (stripEnd > 0 && (content[stripEnd - 1] === 10 || content[stripEnd - 1] === 13 || content[stripEnd - 1] === 32 || content[stripEnd - 1] === 9)) {
            stripEnd--;
          }
          content = content.subarray(0, stripEnd);
        }
        const injection = p === 'dist/preload.js' ? script : mainScript;
        content = Buffer.concat([content, Buffer.from('\n\n// BEGIN LOCAL ASCII WALLPAPERS\n'), Buffer.from(injection)]);
        const blockSize = item.integrity?.blockSize || 4194304;
        const blocks = [];
        for (let i = 0; i < content.length; i += blockSize) {
          blocks.push(sha(content.subarray(i, i + blockSize)));
        }
        item.integrity = { algorithm: 'SHA256', hash: sha(content), blockSize, blocks };
      }
      item.offset = String(offset);
      item.size = content.length;
      offset += content.length;
      chunks.push(content);
    }
  }
  walk(header);

  const json = Buffer.from(JSON.stringify(header));
  const padded = Math.ceil((4 + json.length) / 4) * 4;
  const head = Buffer.alloc(8 + padded);
  head.writeUInt32LE(4 + padded, 0);
  head.writeUInt32LE(json.length, 4);
  json.copy(head, 8);
  const size = Buffer.alloc(8);
  size.writeUInt32LE(4, 0);
  size.writeUInt32LE(head.length, 4);
  const output = Buffer.concat([size, head, ...chunks]);

  // Verify every packed file after rebuilding offsets, including the edited preload.
  const decoded = parse(output);
  function verify(tree) {
    for (const item of Object.values(tree.files || {})) {
      if (item.files) {
        verify(item);
        continue;
      }
      if (item.unpacked || item.link) continue;
      const data = output.subarray(decoded.dataStart + Number(item.offset), decoded.dataStart + Number(item.offset) + item.size);
      if (data.length !== item.size || (item.integrity && sha(data) !== item.integrity.hash)) {
        throw Error('Repacked archive verification failed');
      }
    }
  }
  verify(decoded.header);
  return output;
}

function sleepSync(ms) {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  } catch (_) {
    const end = Date.now() + ms;
    while (Date.now() < end) {}
  }
}

function safeReplace(target, bytes) {
  const temp = target + '.ascii-wallpapers.tmp';
  fs.writeFileSync(temp, bytes);
  const maxRetries = 5;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (process.platform === 'win32') {
        try {
          fs.renameSync(temp, target);
          return;
        } catch (err) {
          if (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EEXIST') {
            try { fs.unlinkSync(target); } catch (_) {}
            fs.renameSync(temp, target);
            return;
          }
          throw err;
        }
      } else {
        fs.renameSync(temp, target);
        return;
      }
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries && (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES' || err.code === 'ETXTBSY')) {
        log(`Target locked (${err.code}), retrying in ${attempt * 250}ms (attempt ${attempt}/${maxRetries})...`);
        sleepSync(attempt * 250);
        continue;
      }
      break;
    }
  }

  try { if (fs.existsSync(temp)) fs.unlinkSync(temp); } catch (_) {}
  throw lastError || new Error('Failed to replace ' + target);
}

function printHelp() {
  console.log(`Insom Agy Wall Project - Antigravity ASCII Wallpaper Manager

Usage:
  node manage-wallpapers.cjs install [options]
  node manage-wallpapers.cjs restore [options]
  node manage-wallpapers.cjs verify [options]
  node manage-wallpapers.cjs --print-path

Commands:
  install       Patch Antigravity with live animated ASCII wallpapers
  restore       Restore pristine backup of original Antigravity app
  verify        Verify that archive unpacking and repack integrity hashes match without writing
  --print-path  Detect and output resolved path to Antigravity app.asar

Options:
  --asar <path> Explicitly specify target app.asar path or installation directory
  --force       Bypass build hash verification (proceed at own risk on uninspected builds)
  -h, --help    Show this help message
`);
}

function main() {
  let action = null;
  let customAsar = null;
  let force = false;
  let printPath = false;

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === 'install' || arg === 'restore' || arg === 'verify') {
      action = arg;
    } else if (arg === '--force') {
      force = true;
    } else if (arg === '--print-path') {
      printPath = true;
    } else if (arg === '--asar') {
      if (i + 1 < args.length) {
        customAsar = args[++i];
      } else {
        throw Error('--asar requires a path argument');
      }
    } else if (arg.startsWith('--asar=')) {
      customAsar = arg.substring('--asar='.length);
    } else if (arg === '-h' || arg === '--help') {
      printHelp();
      return;
    } else {
      throw Error(`Unknown option or argument: ${arg}`);
    }
  }

  const archive = resolveArchive(customAsar);

  if (printPath) {
    if (fs.existsSync(archive)) {
      console.log(archive);
      return;
    } else {
      error('Antigravity archive not found at ' + archive);
      process.exitCode = 1;
      return;
    }
  }

  if (!action) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(archive)) {
    throw Error('Antigravity archive not found at ' + archive);
  }

  const backup = archive + '.ascii-wallpapers.backup';
  const receipt = archive + '.ascii-wallpapers.json';
  const isSupported = h => force || SUPPORTED_HASHES.includes(h);

  let original = fs.readFileSync(archive);
  const digest = sha(original);

  if (action === 'restore') {
    if (!fs.existsSync(receipt) && !fs.existsSync(backup)) {
      throw Error('No wallpaper backup found at ' + backup);
    }
    let r = null;
    if (fs.existsSync(receipt)) {
      try { r = JSON.parse(fs.readFileSync(receipt, 'utf8')); } catch (_) {}
    }
    if (r && digest === r.original) {
      log('Original app is already restored.');
      return;
    }
    if (r && !force && digest !== r.patched) {
      throw Error('The app has changed since installation. Refusing to overwrite a newer app (use --force to override).');
    }
    const b = fs.readFileSync(backup);
    if (r && sha(b) !== r.original) {
      throw Error('Backup checksum does not match expected receipt hash');
    }
    safeReplace(archive, b);
    if (r) {
      try {
        r.restoredAt = new Date().toISOString();
        fs.writeFileSync(receipt, JSON.stringify(r, null, 2));
      } catch (_) {}
    }
    log('Original Antigravity restored. Reload its window to remove wallpapers.');
    return;
  }

  if (fs.existsSync(receipt)) {
    try {
      const r = JSON.parse(fs.readFileSync(receipt, 'utf8'));
      if (digest === r.patched) {
        if (fs.existsSync(backup)) {
          original = fs.readFileSync(backup);
          if (!isSupported(sha(original))) throw Error('Original backup checksum does not match');
        }
      }
    } catch (e) {
      if (e.message.includes('checksum')) throw e;
    }
  }

  if (!isSupported(sha(original))) {
    if (fs.existsSync(backup)) {
      const backupBytes = fs.readFileSync(backup);
      if (isSupported(sha(backupBytes))) {
        original = backupBytes;
      }
    }
  }

  if (!isSupported(sha(original))) {
    throw Error(
      'This installer supports inspected Antigravity builds only (Win 2.28.2, Linux 2.24.0).\n' +
      'Found SHA-256: ' + sha(original) + '\n' +
      'App files have changed; inspect the new build or specify --force to bypass.'
    );
  }

  if (force && !SUPPORTED_HASHES.includes(sha(original))) {
    log('Warning: Proceeding with uninspected app build due to --force flag.');
  }

  const script = fs.readFileSync(path.join(__dirname, 'wallpaper-scenes.js'), 'utf8') + '\n' +
                 fs.readFileSync(path.join(__dirname, 'ascii-wallpapers.js'), 'utf8');
  const mainScript = fs.readFileSync(path.join(__dirname, 'wallpapers-main.js'), 'utf8');
  const patched = repack(original, script, mainScript);

  if (action === 'verify') {
    log('Archive rebuild verified, with all packed file integrity hashes intact. No files changed.');
    return;
  }

  if (digest === sha(patched)) {
    log('Latest ASCII wallpapers are installed; checksum verified.');
    return;
  }

  if (fs.existsSync(backup) && sha(fs.readFileSync(backup)) !== sha(original)) {
    throw Error('An existing backup belongs to another app build; it was preserved.');
  }

  if (!fs.existsSync(backup)) {
    fs.writeFileSync(backup, original, { flag: 'wx' });
  }

  const appVersion = extractVersion(original);

  // Perform safeReplace of archive BEFORE writing the receipt
  safeReplace(archive, patched);

  // STRICTLY AFTER replace succeeds, record transactional receipt
  const r = {
    version: appVersion,
    original: sha(original),
    patched: sha(patched),
    installedAt: new Date().toISOString(),
    backup
  };
  fs.writeFileSync(receipt, JSON.stringify(r, null, 2));
  log('Installed ASCII wallpapers. Original archive backed up at ' + backup);
}

try {
  main();
} catch (e) {
  error(e.message);
  process.exitCode = 1;
}
