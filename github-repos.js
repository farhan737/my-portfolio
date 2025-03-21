// GitHub Repository Fetcher
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the code page
    const repoGrid = document.querySelector('.repo-grid');
    if (!repoGrid) return;

    // Clear any static repository cards
    repoGrid.innerHTML = '<div class="loading">Loading repositories...</div>';

    // Fetch repositories from GitHub API
    fetchRepositories();

    async function fetchRepositories() {
        try {
            const response = await fetch('https://api.github.com/users/farhan737/repos');
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            displayRepositories(repos);
        } catch (error) {
            console.error('Error fetching repositories:', error);
            repoGrid.innerHTML = `
                <div class="error-message">
                    <h3>Could not load repositories</h3>
                    <p>${error.message}</p>
                    <p>Please try again later or visit <a href="https://github.com/farhan737" target="_blank">GitHub directly</a>.</p>
                </div>
            `;
        }
    }

    function displayRepositories(repos) {
        // Clear loading message
        repoGrid.innerHTML = '';
        
        if (repos.length === 0) {
            repoGrid.innerHTML = '<p>No repositories found.</p>';
            return;
        }

        // Sort repositories by last updated
        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // Create a card for each repository
        repos.forEach(repo => {
            // Skip forked repositories if they don't have a description
            if (repo.fork && !repo.description) return;

            // Create repository card
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            
            // Determine language colors
            const languageColors = {
                JavaScript: '#f1e05a',
                TypeScript: '#3178c6',
                HTML: '#e34c26',
                CSS: '#563d7c',
                Java: '#b07219',
                Python: '#3572A5',
                'C#': '#178600',
                PHP: '#4F5D95',
                Ruby: '#701516',
                Go: '#00ADD8',
                Swift: '#F05138',
                Kotlin: '#A97BFF',
                Dart: '#00B4AB',
                Rust: '#DEA584',
                null: '#cccccc'
            };

            // Generate tech tags based on languages used
            let techTags = '';
            if (repo.language) {
                techTags += `<span class="tech-tag" style="background-color: ${languageColors[repo.language] || '#f0f0f0'}; color: ${getContrastColor(languageColors[repo.language] || '#f0f0f0')}">${repo.language}</span>`;
            }
            
            // Add fork tag if it's a fork
            if (repo.fork) {
                techTags += `<span class="tech-tag fork-tag">Fork</span>`;
            }

            // Limit description length to prevent layout issues
            const description = repo.description ? repo.description : 'No description available';
            const truncatedDescription = description.length > 120 ? description.substring(0, 120) + '...' : description;

            repoCard.innerHTML = `
                <div class="repo-header">
                    <h2 class="repo-title">${repo.name}</h2>
                    <span class="repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
                </div>
                <p class="repo-description">${truncatedDescription}</p>
                <div class="repo-tech">
                    ${techTags}
                </div>
                <div class="repo-footer">
                    <div class="repo-stats">
                        <span class="repo-stat">
                            <i class="material-icons">star</i> ${repo.stargazers_count}
                        </span>
                        <span class="repo-stat">
                            <i class="material-icons">call_split</i> ${repo.forks_count}
                        </span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="repo-link">View on GitHub</a>
                </div>
            `;
            
            repoGrid.appendChild(repoCard);
        });

        // Force layout recalculation to ensure proper grid display
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }

    // Helper function to determine text color based on background color
    function getContrastColor(hexColor) {
        // If no color or invalid format, return black
        if (!hexColor || hexColor === '#f0f0f0') return '#333';
        
        // Convert hex to RGB
        let r = 0, g = 0, b = 0;
        
        // 3 digits
        if (hexColor.length === 4) {
            r = parseInt(hexColor[1] + hexColor[1], 16);
            g = parseInt(hexColor[2] + hexColor[2], 16);
            b = parseInt(hexColor[3] + hexColor[3], 16);
        }
        // 6 digits
        else if (hexColor.length === 7) {
            r = parseInt(hexColor.substring(1, 3), 16);
            g = parseInt(hexColor.substring(3, 5), 16);
            b = parseInt(hexColor.substring(5, 7), 16);
        }
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return white for dark colors, black for light colors
        return luminance > 0.5 ? '#333' : '#fff';
    }
});
