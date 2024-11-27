import * as path from 'path';
import scanner from './lib/scanner'
import handler from './lib/handler'

const DIR_PATH = path.resolve('../../backend/static');

(async () => {
    const dirs = await scanner(DIR_PATH);
    dirs.forEach(handler)
})()

/*





// Массив временных точек в формате [start, end]
const fragments: Fragment[] = [
    { start: '00:00:00', end: '00:00:20' },  // 1-й фрагмент с 0:00 до 0:20
    { start: '00:00:30', end: '00:01:00' },  // 2-й фрагмент с 0:30 до 1:00
    // Добавьте больше фрагментов по необходимости
];




*/