import * as path from 'path';
import scanner from './lib/scanner'
import handler from './lib/handler'

const DIR_PATH = path.resolve(__dirname, '../../backend/static');

(async () => {
    const dirs = await scanner(DIR_PATH);
    dirs.forEach(handler)
})()
