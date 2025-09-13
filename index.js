require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');

const MUSTACHE_MAIN_DIR = './main.mustache';

// Badge data organized into categorized table structure
const badgeGrid = [
  // Row 1: Programming Languages
  [
    { alt: 'Go', src: 'https://img.shields.io/badge/-Go-00ADD8?style=flat-square&logo=Go&logoColor=white' },
    {
      alt: 'Python',
      src: 'https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=Python&logoColor=white',
    },
    {
      alt: 'JavaScript',
      src: 'https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black',
    },
    {
      alt: 'TypeScript',
      src: 'https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white',
    },
  ],

  // Row 2: Web Technologies
  [
    {
      alt: 'HTML5',
      src: 'https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white',
    },
    {
      alt: 'CSS',
      src: 'https://img.shields.io/badge/-CSS-1572B6?style=flat-square&logo=css3&logoColor=white',
    },
    {
      alt: 'ReactJS',
      src: 'https://img.shields.io/badge/-ReactJs-61DAFB?style=flat-square&logo=react&logoColor=black',
    },
    {
      alt: 'Nextjs',
      src: 'https://img.shields.io/badge/-NextJs-000000?style=flat-square&logo=next.js&logoColor=white',
    },
  ],

  // Row 3: Backend & APIs
  [
    {
      alt: 'Nodejs',
      src: 'https://img.shields.io/badge/-Nodejs-339933?style=flat-square&logo=Node.js&logoColor=white',
    },
    {
      alt: 'FastAPI',
      src: 'https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white',
    },
    {
      alt: 'GraphQL',
      src: 'https://img.shields.io/badge/-GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white',
    },
    {
      alt: 'RestAPI',
      src: 'https://img.shields.io/badge/-RestAPI-FF6C37?style=flat-square&logo=postman&logoColor=white',
    },
  ],

  // Row 4: Databases
  [
    {
      alt: 'PostgreSQL',
      src: 'https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=PostgreSQL&logoColor=white',
    },
    {
      alt: 'MongoDB',
      src: 'https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white',
    },
    {
      alt: 'MySQL',
      src: 'https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white',
    },
    {
      alt: 'SQLite',
      src: 'https://img.shields.io/badge/-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white',
    },
  ],

  // Row 5: Development Tools
  [
    {
      alt: 'Git',
      src: 'https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white',
    },
    {
      alt: 'Github',
      src: 'https://img.shields.io/badge/-Github-181717?style=flat-square&logo=github&logoColor=white',
    },
    {
      alt: 'Docker',
      src: 'https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white',
    },
    {
      alt: 'Swagger',
      src: 'https://img.shields.io/badge/-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black',
    },
  ],
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

// Function to organize badges into comprehensive categorized table
function organizeBadgesIntoCategorizedGrid() {
  return badgeGrid.map(row => ({
    badges: row,
  }));
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
  // Organize badges into categorized table format
  DATA.rows = organizeBadgesIntoCategorizedGrid();

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
