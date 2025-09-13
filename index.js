require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');

const MUSTACHE_MAIN_DIR = './main.mustache';

// Badge data organized by categories
const badges = [
  { alt: 'Go', src: 'https://img.shields.io/badge/-Go-007ACC?style=flat-square&logo=Go&logoColor=white' },
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
    src: 'https://img.shields.io/badge/-JavaScript-007ACC?style=flat-square&logo=javascript&logoColor=white',
  },
  {
    alt: 'HTML5',
    src: 'https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white',
  },
  { alt: 'CSS', src: 'https://img.shields.io/badge/-CSS-E34F26?style=flat-square&logo=css&logoColor=white' },

  { alt: 'Git', src: 'https://img.shields.io/badge/-Git-F7B93E?style=flat-square&logo=Git&logoColor=white' },
  {
    alt: 'Github',
    src: 'https://img.shields.io/badge/-Github-43853d?style=flat-square&logo=Github&logoColor=white',
  },
  {
    alt: 'Docker',
    src: 'https://img.shields.io/badge/-Docker-46a2f1?style=flat-square&logo=docker&logoColor=white',
  },
  {
    alt: 'Swagger',
    src: 'https://img.shields.io/badge/-Swagger-46a2f1?style=flat-square&logo=swagger&logoColor=white',
  },

  {
    alt: 'FastAPI',
    src: 'https://img.shields.io/badge/-FastAPI-45b8d8?style=flat-square&logo=fastapi&logoColor=white',
  },
  {
    alt: 'RestAPI',
    src: 'https://img.shields.io/badge/-RestAPI-F7B93E?style=flat-square&logo=restapi&logoColor=white',
  },
  {
    alt: 'GraphQL',
    src: 'https://img.shields.io/badge/-GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white',
  },

  {
    alt: 'Github Actions',
    src: 'https://img.shields.io/badge/-Github_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white',
  },
  {
    alt: 'Heroku',
    src: 'https://img.shields.io/badge/-Heroku-430098?style=flat-square&logo=heroku&logoColor=white',
  },
  {
    alt: 'Railway',
    src: 'https://img.shields.io/badge/-Railway-46a2f1?style=flat-square&logo=railway&logoColor=white',
  },
  {
    alt: 'Vercel',
    src: 'https://img.shields.io/badge/-Vercel-46a2f1?style=flat-square&logo=vercel&logoColor=white',
  },
  {
    alt: 'Netlify',
    src: 'https://img.shields.io/badge/-Netlify-46a2f1?style=flat-square&logo=netlify&logoColor=white',
  },
  {
    alt: 'Cloudflare',
    src: 'https://img.shields.io/badge/-Cloudflare-46a2f1?style=flat-square&logo=cloudflare&logoColor=white',
  },
  {
    alt: 'Render',
    src: 'https://img.shields.io/badge/-Render-46a2f1?style=flat-square&logo=render&logoColor=white',
  },

  {
    alt: 'VsCode',
    src: 'https://img.shields.io/badge/-VsCode-46a2f1?style=flat-square&logo=vscode&logoColor=white',
  },
  { alt: 'Zed', src: 'https://img.shields.io/badge/-Zed-46a2f1?style=flat-square&logo=zed&logoColor=white' },
  {
    alt: 'NeoVim',
    src: 'https://img.shields.io/badge/-NeoVim-46a2f1?style=flat-square&logo=neovim&logoColor=white',
  },

  {
    alt: 'Postman',
    src: 'https://img.shields.io/badge/-Postman-46a2f1?style=flat-square&logo=postman&logoColor=white',
  },
  {
    alt: 'Curl',
    src: 'https://img.shields.io/badge/-Curl-46a2f1?style=flat-square&logo=curl&logoColor=white',
  },
  {
    alt: 'Insomnia',
    src: 'https://img.shields.io/badge/-Insomnia-5849BE?style=flat-square&logo=insomnia&logoColor=white',
  },

  { alt: 'UV', src: 'https://img.shields.io/badge/-UV-CB3837?style=flat-square&logo=uv&logoColor=white' },
  { alt: 'NPM', src: 'https://img.shields.io/badge/-NPM-CB3837?style=flat-square&logo=npm&logoColor=white' },
  {
    alt: 'D3.js',
    src: 'https://img.shields.io/badge/-D3.js-F9A03C?style=flat-square&logo=d3.js&logoColor=white',
  },
  {
    alt: 'Nodejs',
    src: 'https://img.shields.io/badge/-Nodejs-43853d?style=flat-square&logo=Node.js&logoColor=white',
  },
  {
    alt: 'ReactJS',
    src: 'https://img.shields.io/badge/-ReactJs-46a2f1?style=flat-square&logo=reactjs&logoColor=white',
  },
  {
    alt: 'Nextjs',
    src: 'https://img.shields.io/badge/-NextJs-46a2f1?style=flat-square&logo=nextjs&logoColor=white',
  },

  {
    alt: 'Firefox',
    src: 'https://img.shields.io/badge/-Firefox-FB542B?style=flat-square&logo=firefox&logoColor=white',
  },
  {
    alt: 'Linux',
    src: 'https://img.shields.io/badge/-Linux-46a2f1?style=flat-square&logo=linux&logoColor=white',
  },
  {
    alt: 'Ubuntu',
    src: 'https://img.shields.io/badge/-Ubuntu-46a2f1?style=flat-square&logo=ubuntu&logoColor=white',
  },

  {
    alt: 'MySql',
    src: 'https://img.shields.io/badge/-MySql-46a2f1?style=flat-square&logo=mysql&logoColor=white',
  },
  {
    alt: 'SQLite',
    src: 'https://img.shields.io/badge/-SQLite-46a2f1?style=flat-square&logo=sqlite&logoColor=white',
  },
  {
    alt: 'MongoDB',
    src: 'https://img.shields.io/badge/-MongoDB-13aa52?style=flat-square&logo=mongodb&logoColor=white',
  },
  {
    alt: 'PostgreSQL',
    src: 'https://img.shields.io/badge/-PostgreSQL-45b8d8?style=flat-square&logo=PostgreSQL&logoColor=white',
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
  // Organize badges into table format
  DATA.rows = organizeBadgesIntoRows(badges, 3);

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
