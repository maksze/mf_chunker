import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';

// Функция для вычисления продолжительности
function getDuration(start: string, end: string): number {
  const startParts = start.split(':').map(Number);
  const endParts = end.split(':').map(Number);

  const startSeconds = startParts[0] * 3600 + startParts[1] * 60 + startParts[2];
  const endSeconds = endParts[0] * 3600 + endParts[1] * 60 + endParts[2];

  return endSeconds - startSeconds;
}

// Тип для временных фрагментов
interface Fragment {
  start: string;
  end: string;
}

const handler = (dirPath: string) => {
  try {
    const inputPath = path.join(dirPath, 'source.mp4');
    const outputDir = path.join(dirPath, 'output');
    const fileData = fs.readFileSync(path.join(dirPath, 'data.json'), 'utf8');

    const jsonData = JSON.parse(fileData);

    // Убедитесь, что директория для выходных файлов существует
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Функция для генерации фрагментов
    jsonData.fragments.forEach((fragment, index) => {
        // Создаем имя директории для текущего фрагмента
      const fragmentDir = path.join(outputDir, `${fragment.start}_${fragment.end}`);
      // Создаем полный путь к файлу внутри этой директории
      const outputPath = path.join(fragmentDir, 'chunk.mp4');
      // Создаем полный путь к JSON-файлу с метаинформацией
      const metaPath = path.join(fragmentDir, 'meta.json');

      // Проверяем, существует ли уже директория для фрагмента
      if (!fs.existsSync(fragmentDir)) {
          fs.mkdirSync(fragmentDir, { recursive: true });
          console.log(`Создана директория для фрагмента ${index + 1}: ${fragmentDir}`);
      }

      // Проверяем, существует ли уже файл с таким именем
      if (fs.existsSync(outputPath)) {
          console.log(`Фрагмент ${index + 1} уже существует: ${outputPath}`);
          return;
      }
      
      ffmpeg(inputPath)
          .setStartTime(fragment.start)
          .setDuration(fragment.end - fragment.start)
          .output(outputPath)
          .on('end', () => {
              console.log(`Фрагмент ${index + 1} успешно создан: ${outputPath}`);
              // Создаем объект с метаинформацией
              const metaInfo = {
                  ...fragment,
                  index: index + 1,
                  start: fragment.start,
                  end: fragment.end,
                  duration: fragment.end - fragment.start,
                  outputPath: outputPath
              };

              // Сохраняем метаинформацию в JSON-файл
              fs.writeFileSync(metaPath, JSON.stringify(metaInfo, null, 2));
              console.log(`Метаинформация для фрагмента ${index + 1} сохранена: ${metaPath}`);
              })
          .on('error', (err) => {
              console.error(`Ошибка при создании фрагмента ${index + 1}: ${err.message}`);
          })
          .run();
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

export default handler;