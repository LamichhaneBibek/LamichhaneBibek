require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');

const MUSTACHE_MAIN_DIR = './main.mustache';

// Badge data organized by categories
const badges = [
  {
    alt: 'Go',
    src: 'https://img.shields.io/badge/-Go-007ACC?style=flat-square&logo=Go&logoColor=white',
  },
  {
    alt: 'Python',
    src: 'https://img.shields.io/badge/-Python-45b8d8?style=flat-square&logo=Python&logoColor=white',
  },
  {
    alt: 'TypeScript',
    src: 'https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white',
  },
  {
    alt: 'JavaScript',
    src: 'https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black',
  },
  {
    alt: 'PostgreSQL',
    src: 'https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=PostgreSQL&logoColor=white',
  },
  {
    alt: 'MongoDB',
    src: 'https://img.shields.io/badge/-MongoDB-13aa52?style=flat-square&logo=mongodb&logoColor=white',
  },
  {
    alt: 'FastAPI',
    src: 'https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white',
  },
  {
    alt: 'Node.js',
    src: 'https://img.shields.io/badge/-Nodejs-43853d?style=flat-square&logo=Node.js&logoColor=white',
  },
  {
    alt: 'Docker',
    src: 'https://img.shields.io/badge/-Docker-46a2f1?style=flat-square&logo=docker&logoColor=white',
  },
  {
    alt: 'Git',
    src: 'https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white',
  },
  {
    alt: 'GitHub',
    src: 'https://img.shields.io/badge/-Github-181717?style=flat-square&logo=Github&logoColor=white',
  },
  {
    alt: 'GitHub Actions',
    src: 'https://img.shields.io/badge/-Github_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white',
  },
  {
    alt: 'HTML5',
    src: 'https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white',
  },
  {
    alt: 'GraphQL',
    src: 'https://img.shields.io/badge/-GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white',
  },
  {
    alt: 'Heroku',
    src: 'https://img.shields.io/badge/-Heroku-430098?style=flat-square&logo=heroku&logoColor=white',
  },
];

let DATA = {
  refresh_date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Asia/Kathmandu',
  }),
};

// Function to organize badges into table rows (3 badges per row)
function organizeBadgesIntoRows(badges, itemsPerRow = 3) {
  const rows = [];
  for (let i = 0; i < badges.length; i += itemsPerRow) {
    rows.push({
      badges: badges.slice(i, i + itemsPerRow),
    });
  }
  return rows;
}

async function setWeatherInformation() {
  try {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=pokhara&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
    )
      .then(r => r.json())
      .then(r => {
        if (!r) return;
        DATA.city_temperature = Math.round(r?.main?.temp || 20);
        DATA.city_weather = r?.weather && r.weather[0]?.description;
        DATA.city_weather_icon = r?.weather && r?.weather[0]?.icon;
        DATA.sun_rise = new Date(r.sys?.sunrise * 1000).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kathmandu',
        });
        DATA.sun_set = new Date(r.sys?.sunset * 1000).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kathmandu',
        });
      });
  } catch (error) {
    console.log('Weather API error:', error);
  }
}

async function setInstagramPosts() {
  try {
    const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount('visitstockholm', 3);
    DATA.img1 = instagramImages[0];
    DATA.img2 = instagramImages[1];
    DATA.img3 = instagramImages[2];
  } catch (error) {
    console.log('Instagram scraping error:', error);
  }
}

async function generateReadMe() {
  // Organize badges into 3x3 table format
  DATA.rows = organizeBadgesInto3x3Grid();

  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
    console.log('README.md generated successfully!');
  });
}

async function action() {
  try {
    /**
     * Fetch Weather (optional - for Pokhara instead of Stockholm)
     */
    await setWeatherInformation();

    /**
     * Get pictures (optional - keep or remove based on your needs)
     */
    // await setInstagramPosts();

    /**
     * Generate README
     */
    await generateReadMe();

    /**
     * Close puppeteer (only if it was used)
     */
    await puppeteerService.close();

    console.log('README generation completed successfully!');
  } catch (error) {
    console.error('Error in action:', error);
    process.exit(1);
  }
}

action();
