// @ts-ignore
// @ts-nocheck
import { Telegraf, Context } from 'telegraf';
import { Repository } from 'typeorm';
import { Video } from './entity/Video';
import { dataSource } from './shared/db'
import { reviewCard, REVIEW_OUTCOME } from './shared/lib/reviewCard'
import { calcNextReviewDatetime } from './shared/lib/calcNextReviewDatetime'

dataSource.initialize()
  .then(async (connection) => {
    const bot = new Telegraf(process.env.BOT_TOKEN!);
    const videoRepository: Repository<Video> = connection.getRepository(Video);

    bot.start(async (ctx) => {
      if (ctx.message.from.id === Number(process.env.USER_ID)) {
        // Получение случайного видео из базы данных
        const video = await videoRepository.findOne({ order: { reviewedAt: 'ASC' }, where: {} });

        if (video) {
          // Отправка видео с вопросом и кнопками
          await ctx.replyWithVideo({ source: video.url }, {
            caption: video.question,
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Да', callback_data: `yes_${video.id}` }],
                [{ text: 'Нет', callback_data: `no_${video.id}` }],
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
      if (ctx?.from.id === Number(process.env.USER_ID)) {
        const [answer, id] = ctx?.callbackQuery?.data.split('_');

        const OUTCOME = answer == 'yes'
          ? REVIEW_OUTCOME.CORRECT
          : REVIEW_OUTCOME.WRONG;

        const video = await videoRepository.findOne({ order: { id: 'ASC' }, where: { id } });

        const extra = reviewCard(OUTCOME, video.extra?.interval, video.extra?.easeFactor)
        const reviewedAt = calcNextReviewDatetime(video.extra?.interval);

        await videoRepository.update({ id }, {
          extra,
          reviewedAt,
          repetition: Number(video?.repetition || 0) + 1
        });

        await ctx.reply("done");
      }
    });

    bot.launch();
  })
  .catch((error) => console.log(error));