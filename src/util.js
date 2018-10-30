import glob from 'glob';
import path from 'path';

const getCamelCaseFileName = (cwd, filename) => {
    const normalCwd = path.normalize(cwd);
    const normalFilename = path.normalize(filename);
    return normalFilename
        .replace(`${normalCwd}`, '')
        .slice(1)
        .replace(/\.jsx?/, '')
        .replace(/^([A-Z])|[\s-_./\\](\w)/g, ($0, $1, $2) => $2 ? $2.toUpperCase() : $1.toUpperCase());
};

const importFile = (filenameUnNormal, cache = true) => {
    const filename = path.normalize(filenameUnNormal);
    if (!cache) {
        delete require.cache[ filename ];
    }
    let mod;
    try {
        mod = require(filename);
        if (mod.__esModule && 'default' in mod) {
            mod = mod.default;
        }
    } catch (err) {
        console.error(`load file error about [${filename}], detail error message: ${err}`);
    }
    return mod;
};

const importFiles = (dir, target = '*') => {
    const files = {};
    const normalDir = path.normalize(dir);
    glob.sync(`${normalDir}/**/${target}.js`).forEach(filename => {
        const name = getCamelCaseFileName(normalDir, filename);
        files[name] = importFile(filename);
    });
    return files;
};

export {
    getCamelCaseFileName,
    importFile,
    importFiles
};
