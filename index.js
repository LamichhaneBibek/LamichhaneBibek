require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');

const MUSTACHE_MAIN_DIR = './main.mustache';

// Badge data organized into categorized table structure with authentic brand colors
const badgeGrid = [
  // Row 1: Programming Languages (First Cell)
  [
    { alt: 'Go', src: 'https://img.shields.io/badge/-Go-00ADD8?style=flat-square&logo=go&logoColor=white' },
    {
      alt: 'Python',
      src: 'https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white',
    },
    {
      alt: 'TypeScript',
      src: 'https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white',
    },
    {
      alt: 'JavaScript',
      src: 'https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black',
    },
    {
      alt: 'HTML5',
      src: 'https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white',
    },
    {
      alt: 'CSS3',
      src: 'https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white',
    },
  ],

  // Row 2: Development Tools (Second Cell)
  [
    {
      alt: 'Git',
      src: 'https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white',
    },
    {
      alt: 'GitHub',
      src: 'https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white',
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

  // Row 3: Backend & APIs
  [
    {
      alt: 'FastAPI',
      src: 'https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white',
    },
    {
      alt: 'Node.js',
      src: 'https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white',
    },
    {
      alt: 'GraphQL',
      src: 'https://img.shields.io/badge/-GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white',
    },
    {
      alt: 'REST API',
      src: 'https://img.shields.io/badge/-REST_API-FF6C37?style=flat-square&logo=postman&logoColor=white',
    },
  ],

  // Row 4: Frontend Frameworks & Libraries
  [
    {
      alt: 'React',
      src: 'https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black',
    },
    {
      alt: 'Next.js',
      src: 'https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white',
    },
    {
      alt: 'D3.js',
      src: 'https://img.shields.io/badge/-D3.js-F9A03C?style=flat-square&logo=d3.js&logoColor=white',
    },
    {
      alt: 'NPM',
      src: 'https://img.shields.io/badge/-NPM-CB3837?style=flat-square&logo=npm&logoColor=white',
    },
  ],

  // Row 5: Databases
  [
    {
      alt: 'PostgreSQL',
      src: 'https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white',
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

  // Row 6: Code Editors & IDEs
  [
    {
      alt: 'VSCode',
      src: 'https://img.shields.io/badge/-VSCode-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white',
    },
    {
      alt: 'NeoVim',
      src: 'https://img.shields.io/badge/-NeoVim-57A143?style=flat-square&logo=neovim&logoColor=white',
    },
    {
      alt: 'Zed',
      src: 'https://img.shields.io/badge/-Zed-084CCF?style=flat-square&logo=zed&logoColor=white',
    },
  ],

  // Row 7: API Testing & Package Managers
  [
    {
      alt: 'Postman',
      src: 'https://img.shields.io/badge/-Postman-FF6C37?style=flat-square&logo=postman&logoColor=white',
    },
    {
      alt: 'Insomnia',
      src: 'https://img.shields.io/badge/-Insomnia-4000BF?style=flat-square&logo=insomnia&logoColor=white',
    },
    {
      alt: 'cURL',
      src: 'https://img.shields.io/badge/-cURL-073551?style=flat-square&logo=curl&logoColor=white',
    },
    { alt: 'UV', src: 'https://img.shields.io/badge/-UV-DE5FE9?style=flat-square&logo=uv&logoColor=white' },
  ],

  // Row 8: Cloud & Deployment Platforms
  [
    {
      alt: 'Heroku',
      src: 'https://img.shields.io/badge/-Heroku-430098?style=flat-square&logo=heroku&logoColor=white',
    },
    {
      alt: 'Vercel',
      src: 'https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white',
    },
    {
      alt: 'Netlify',
      src: 'https://img.shields.io/badge/-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white',
    },
    {
      alt: 'Railway',
      src: 'https://img.shields.io/badge/-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white',
    },
  ],

  // Row 9: Additional Cloud & CI/CD
  [
    {
      alt: 'Cloudflare',
      src: 'https://img.shields.io/badge/-Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white',
    },
    {
      alt: 'Render',
      src: 'https://img.shields.io/badge/-Render-46E3B7?style=flat-square&logo=render&logoColor=white',
    },
    {
      alt: 'GitHub Actions',
      src: 'https://img.shields.io/badge/-GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white',
    },
  ],

  // Row 10: Operating Systems & Browsers
  [
    {
      alt: 'Linux',
      src: 'https://img.shields.io/badge/-Linux-FCC624?style=flat-square&logo=linux&logoColor=black',
    },
    {
      alt: 'Ubuntu',
      src: 'https://img.shields.io/badge/-Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white',
    },
    {
      alt: 'Firefox',
      src: 'https://img.shields.io/badge/-Firefox-FF7139?style=flat-square&logo=firefox&logoColor=white',
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
