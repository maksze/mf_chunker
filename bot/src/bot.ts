// @ts-ignore
// @ts-nocheck
import "reflect-metadata"
import { Telegraf, Context } from 'telegraf';
import { DataSource, Repository } from 'typeorm';
import { Video } from './entity/Video';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Video],
  synchronize: true,
  logging: false,
});

dataSource.initialize()
  .then(async (connection) => {
    const bot = new Telegraf(process.env.BOT_TOKEN!);
    const videoRepository: Repository<Video> = connection.getRepository(Video);

    bot.start(async (ctx) => {
      if (ctx.message.from.id === Number(process.env.USER_ID)) {
        // Получение случайного видео из базы данных
        const video = await videoRepository.findOne({ order: { id: 'ASC' } });

        if (video) {
          // Отправка видео с вопросом и кнопками
          await ctx.replyWithVideo({ source: video.url }, {
            caption: video.question,
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Да', callback_data: 'yes' }],
                [{ text: 'Нет', callback_data: 'no' }],
              ],
            },
          });
        } else {
          await ctx.reply('Извините, в настоящее время нет доступных видео.');
        }
      } else {
        await ctx.reply('Извините, этот бот доступен только для одного пользователя.');
      }
    });

    bot.on('callback_query', async (ctx: Context) => {
      if (ctx?.message?.from.id === Number(process.env.USER_ID)) {
        if (ctx?.callbackQuery?.data === 'yes') {
          // Сохранение ответа "Да" в базе данных
          await videoRepository.save({ id: 1, answer: 'yes' });
          await ctx.reply('Вы ответили "Да".');
        } else if (ctx?.callbackQuery?.data === 'no') {
          // Сохранение ответа "Нет" в базе данных
          await videoRepository.save({ id: 1, answer: 'no' });
          await ctx.reply('Вы ответили "Нет".');
        }
      }
    });

    bot.launch();
  })
  .catch((error) => console.log(error));