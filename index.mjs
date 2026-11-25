import express from 'express';
import { countries } from 'countries-list';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

const languageCards = [
  { name: 'JavaScript', type: 'High-level / scripting', use: 'Web interactivity and servers', color: 'yellow' },
  { name: 'Python', type: 'High-level / general purpose', use: 'Data, AI, automation, and web apps', color: 'blue' },
  { name: 'Java', type: 'High-level / object-oriented', use: 'Enterprise software and Android', color: 'red' },
  { name: 'C++', type: 'Compiled / systems', use: 'Games, operating systems, and performance', color: 'purple' }
];

const packageLanguages = Object.entries(countries)
  .filter(([, country]) => country.languages?.includes('eng'))
  .slice(0, 6)
  .map(([code, country]) => ({ code, name: country.name, currency: country.currency?.[0] || 'N/A' }));

async function getGitHubData() {
  const response = await fetch('https://api.github.com/repos/nodejs/node', {
    headers: { 'User-Agent': 'hw1-express-student-project' }
  });
  if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
  return response.json();
}

app.get('/', (req, res) => {
  res.render('home', { title: 'Programming Languages', languageCards });
});

app.get('/languages', (req, res) => {
  res.render('languages', { title: 'Language Guide', languageCards });
});

app.get('/api-lab', async (req, res) => {
  try {
    const repo = await getGitHubData();
    res.render('api-lab', { title: 'Web API Lab', repo, error: null });
  } catch (error) {
    res.render('api-lab', { title: 'Web API Lab', repo: null, error: 'The API is temporarily unavailable. Please refresh later.' });
  }
});

app.get('/package-data', (req, res) => {
  res.render('package-data', { title: 'Node Package Data', packageLanguages });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About This Project' });
});

app.listen(PORT, () => {
  console.log(`Programming Languages site running on port ${PORT}`);
});
