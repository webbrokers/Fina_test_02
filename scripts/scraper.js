const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { URL } = require('url');

const targetUrl = 'https://finabank.ru/collection/zajmy-s-plohoj-kreditnoj-istoriej/';
const outputDir = path.join(__dirname, '..', 'v1');
const assetsDir = path.join(outputDir, 'assets');

// Создаём папки если не существуют
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

/**
 * Скачивает ассет (CSS, JS, картинка) и сохраняет в папку assets/
 * Возвращает локальный путь к файлу
 */
async function downloadAsset(assetUrl, baseUrl) {
    try {
        // Преобразуем относительный URL в абсолютный
        const absoluteUrl = new URL(assetUrl, baseUrl).href;

        // Скачиваем только http/https ресурсы
        if (!absoluteUrl.startsWith('http')) return assetUrl;

        const parsedUrl = new URL(absoluteUrl);
        const ext = path.extname(parsedUrl.pathname) || '.bin';

        // Генерируем уникальное имя файла на основе URL
        const hash = Buffer.from(absoluteUrl).toString('base64').substring(0, 16).replace(/[/+=]/g, '_');
        const fileName = `${hash}${ext}`;
        const filePath = path.join(assetsDir, fileName);

        // Не скачиваем повторно если файл уже есть
        if (!fs.existsSync(filePath)) {
            const response = await axios.get(absoluteUrl, {
                responseType: 'arraybuffer',
                timeout: 15000,
                // Имитируем обычный браузер
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Referer': 'https://finabank.ru/',
                },
            });
            fs.writeFileSync(filePath, response.data);
        }

        return `assets/${fileName}`;
    } catch (e) {
        console.error(`  [ПРОПУСК] ${assetUrl}: ${e.message}`);
        return assetUrl; // Если не удалось скачать — оставляем оригинальную ссылку
    }
}

(async () => {
    console.log('=== Запуск scraper.js ===');
    console.log(`Цель: ${targetUrl}`);

    // Запускаем браузер в НЕ headless режиме с anti-detection настройками
    const browser = await chromium.launch({
        headless: true,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });

    // Создаём контекст с реальным user-agent и настройками
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        locale: 'ru-RU',
        timezoneId: 'Asia/Yekaterinburg',
        viewport: { width: 1440, height: 900 },
        extraHTTPHeaders: {
            'Accept-Language': 'ru-RU,ru;q=0.9',
        },
    });

    // Скрываем признаки автоматизации через JavaScript
    await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
        Object.defineProperty(navigator, 'languages', { get: () => ['ru-RU', 'ru', 'en-US'] });
    });

    const page = await context.newPage();

    console.log('Загружаем страницу...');
    try {
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    } catch (e) {
        console.log(`Предупреждение при загрузке: ${e.message}`);
        console.log('Продолжаем со страницей, которая успела загрузиться...');
    }

    // Небольшая пауза чтобы всё отрендерилось
    await page.waitForTimeout(3000);

    // Прокрутка вниз для подгрузки lazy-load элементов
    console.log('Прокручиваем страницу для загрузки всех элементов...');
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 150);
        });
    });

    await page.waitForTimeout(2000);

    // Получаем финальный HTML после рендеринга
    let content = await page.content();
    const baseUrl = targetUrl;

    console.log('Ищем ассеты для скачивания...');

    // Парсим все src и href из HTML
    const regex = /(src|href)="([^"]+)"/g;
    let match;
    const assets = new Set();

    while ((match = regex.exec(content)) !== null) {
        const url = match[2];
        // Берём только медиа, стили и скрипты — пропускаем якоря, mailto, аналитику
        if (
            !url.startsWith('#') &&
            !url.startsWith('mailto:') &&
            !url.startsWith('tel:') &&
            !url.startsWith('javascript:') &&
            !url.startsWith('data:') &&
            !url.includes('google-analytics') &&
            !url.includes('googletagmanager') &&
            !url.includes('mc.yandex.ru') &&
            !url.includes('facebook.net') &&
            (url.startsWith('http') || url.startsWith('/') || url.startsWith('./'))
        ) {
            // Скачиваем только статику (CSS, JS, изображения, шрифты)
            const hasStaticExt = /\.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|ico)(\?|$)/i.test(url);
            if (hasStaticExt) {
                assets.add(url);
            }
        }
    }

    console.log(`Найдено статических ассетов: ${assets.size}`);
    console.log('Начинаем скачивание ассетов...');

    let i = 0;
    for (const asset of assets) {
        i++;
        process.stdout.write(`\r  Скачиваем [${i}/${assets.size}]: ${asset.substring(0, 60)}...`);
        const localPath = await downloadAsset(asset, baseUrl);
        // Заменяем все вхождения оригинального URL на локальный путь
        content = content.split(`"${asset}"`).join(`"${localPath}"`);
    }

    console.log('\nСохраняем index.html...');
    fs.writeFileSync(path.join(outputDir, 'index.html'), content, 'utf-8');

    console.log('✅ Готово! Страница сохранена в папку v1/');
    console.log(`   - HTML: v1/index.html`);
    console.log(`   - Ассеты: v1/assets/ (${i} файлов)`);

    await browser.close();
})();
