import semver from 'semver';

import Monking from './monking';
import { engines } from '../package';

Object.keys(engines).forEach(engine => {
    const current = process.versions[engine];
    const range = engines[engine];
    if (!semver.satisfies(current, range)) {
        throw new Error(`require ${engine} version ${range}, but current is ${current}`);
    }
});

const app = new Monking();

process.on('uncaughtException', err => {
    console.error('检测到未捕获的异常', err);
});

// unhandledRejection
process.on('unhandledRejection', err => {
    console.error('检测到未捕获的reject', err);
});

app.listen(app.config.port);
