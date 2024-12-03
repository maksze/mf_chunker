import * as fs from 'fs';
import * as path from 'path';
import { Video } from './entity/Video';
import { dataSource } from './shared/db'
import { REVIEW_OUTCOME, reviewCard } from './shared/lib/reviewCard';
import { calcNextReviewDatetime } from './shared/lib/calcNextReviewDatetime';

interface FilePathPair {
    chunk: string;
    meta: string;
}

function findChunkAndMetaFiles(rootDir: string): FilePathPair[] {
    const result: FilePathPair[] = [];

    // Читаем директории первого уровня
    const mainDirectories = fs.readdirSync(rootDir)
        .filter(dir => fs.statSync(path.join(rootDir, dir)).isDirectory());

    // Перебираем каждую директорию первого уровня
    for (const mainDir of mainDirectories) {
        const outputPath = path.join(rootDir, mainDir, 'output');

        // Проверяем существование output директории
        if (!fs.existsSync(outputPath) || !fs.statSync(outputPath).isDirectory()) {
            continue;
        }

        // Читаем поддиректории в output
        const subDirectories = fs.readdirSync(outputPath)
            .filter(dir => fs.statSync(path.join(outputPath, dir)).isDirectory());

        // Перебираем поддиректории
        for (const subDir of subDirectories) {
            const fullSubDirPath = path.join(outputPath, subDir);

            const chunkPath = path.join(fullSubDirPath, 'chunk.mp4');
            const metaPath = path.join(fullSubDirPath, 'meta.json');

            // Проверяем существование обоих файлов
            if (
                fs.existsSync(chunkPath) && 
                fs.existsSync(metaPath)
            ) {
                result.push({
                    chunk: chunkPath,
                    meta: metaPath
                });
            }
        }
    }

    return result;
}

function processFiles(files: FilePathPair[]) {
  const videoRepository = dataSource.getRepository(Video);

  files.map(async (file, index) => {
    // Чтение meta файла
    const metaContent = JSON.parse(fs.readFileSync(file.meta, 'utf8'));
    
    // Извлечение имени поддиректории
    const subdir = path.basename(path.dirname(file.chunk));
    
    const extra = reviewCard(REVIEW_OUTCOME.CORRECT);
    const reviewedAt = calcNextReviewDatetime(index);

    // Создание новой сущности Video
    const video = new Video();
    video.name = subdir;
    video.url = file.chunk;
    video.question = metaContent.title || '';
    video.extra = reviewCard(REVIEW_OUTCOME.CORRECT);
    video.reviewedAt = reviewedAt;
    video.repetition = "1";

    // Сохранение в базу данных
    try {
      await videoRepository.save(video);
    } catch(e) {
      // pass
    }
    
  });
}

(async () => {
  await dataSource.initialize();

  try {
    const rootDirectory = path.resolve(__dirname, '../../backend/static');
    const filePairs = findChunkAndMetaFiles(rootDirectory);
    processFiles(filePairs)
  } catch (error) {
    console.error('Ошибка при поиске файлов:', error);
  }
})()
