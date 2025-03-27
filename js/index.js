let searchType = 'user';

document.getElementById('github-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const searchQuery = document.getElementById('search').value;
  if (!searchQuery) return;

  if (searchType === 'user') {
    fetchUsers(searchQuery);
  } else if (searchType === 'repo') {
    fetchRepos(searchQuery);
  }
});

document.getElementById('toggle-search-type').addEventListener('click', function () {
  if (searchType === 'user') {
    searchType = 'repo';
    this.textContent = 'Search for Users';
  } else {
    searchType = 'user';
    this.textContent = 'Search for Repos';
  }
});

async function fetchUsers(query) {
  const resultsList = document.getElementById('results-list');
  
  resultsList.innerHTML = '';

  try {
    const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const data = await response.json();
    if (data.items) {
      data.items.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
          <a href="https://github.com/${user.login}" target="_blank">
            <img src="${user.avatar_url}" alt="${user.login}" width="50"/>
            <p>${user.login}</p>
          </a>
        `;
        resultsList.appendChild(userItem);
      });
    } else {
      resultsList.innerHTML = '<p>No users found.</p>';
    }
  } catch (error) {
    console.error('Error fetching GitHub users:', error);
  }
}

async function fetchRepos(query) {
  const resultsList = document.getElementById('results-list');
  
  resultsList.innerHTML = '';

  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const data = await response.json();
    if (data.items) {
      data.items.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
          <a href="${repo.html_url}" target="_blank">
            <h4>${repo.name}</h4>
            <p>${repo.description || 'No description'}</p>
          </a>
        `;
        resultsList.appendChild(repoItem);
      });
    } else {
      resultsList.innerHTML = '<p>No repositories found.</p>';
    }
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
  }
}
