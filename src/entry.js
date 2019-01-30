import semver from 'semver';

import Monking from './monking';
import { engines } from '../package';
import { getTimestamp } from './util';

Object.keys(engines).forEach(engine => {
    const current = process.versions[engine];
    const range = engines[engine];
    if (!semver.satisfies(current, range)) {
        throw new Error(`require ${engine} version ${range}, but current is ${current}`);
    }
});

const app = new Monking();

process.on('uncaughtException', err => {
    console.error(`${getTimestamp()} 检测到未捕获的异常`, err);
});

// unhandledRejection
process.on('unhandledRejection', err => {
    console.error(`${getTimestamp()} 检测到未捕获的reject`, err);
});

app.listen(app.config.port, () => {
    app.appLogger.info(`Server is running at http://localhost:${app.config.port}`);
});
