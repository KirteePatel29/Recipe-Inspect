// Main JavaScript for the home page
document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
});

function initializeHomePage() {
    setupSearchForm();
    setupCategoryCards();
    loadFeaturedRecipes();
    setupQuickSearchTags();
}

function setupSearchForm() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                // Store search query and redirect to recipes page
                sessionStorage.setItem('searchQuery', query);
                window.location.href = 'recipes.html';
            }
        });
    }
}

function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category) {
                sessionStorage.setItem('selectedCategory', category);
                window.location.href = 'recipes.html';
            }
        });

        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function setupQuickSearchTags() {
    const searchTags = document.querySelectorAll('.search-tag');
    const searchInput = document.getElementById('searchInput');

    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.dataset.search;
            if (searchTerm && searchInput) {
                searchInput.value = searchTerm;
                sessionStorage.setItem('searchQuery', searchTerm);
                window.location.href = 'recipes.html';
            }
        });
    });
}

function loadFeaturedRecipes() {
    const featuredContainer = document.getElementById('featuredRecipes');
    
    if (!featuredContainer) return;

    // Show loading state
    featuredContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"></div></div>';

    // Simulate loading delay for better UX
    setTimeout(() => {
        const featuredRecipes = getFeaturedRecipes(6);
        displayFeaturedRecipes(featuredRecipes);
    }, 500);
}

function displayFeaturedRecipes(recipes) {
    const featuredContainer = document.getElementById('featuredRecipes');
    
    if (!featuredContainer) return;

    featuredContainer.innerHTML = '';

    recipes.forEach((recipe, index) => {
        const recipeCard = createRecipeCard(recipe);
        
        // Add animation delay
        setTimeout(() => {
            AnimationUtils.slideUp(recipeCard);
        }, index * 100);

        featuredContainer.appendChild(recipeCard);
    });
}

function createRecipeCard(recipe) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const isFavorite = FavoritesManager.isFavorite(recipe.id);
    const favoriteIcon = isFavorite ? 'bi-heart-fill' : 'bi-heart';
    const favoriteClass = isFavorite ? 'active' : '';

    col.innerHTML = `
        <div class="card recipe-card h-100">
            <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" loading="lazy">
            <div class="card-body recipe-card-body">
                <h5 class="card-title">${recipe.name}</h5>
                <p class="card-text text-muted">${recipe.description}</p>
                
                <div class="recipe-meta">
                    <span><i class="bi bi-clock"></i> ${FormatUtils.formatTime(recipe.totalTime)}</span>
                    <span><i class="bi bi-people"></i> ${recipe.servings} servings</span>
                    <span>${FormatUtils.formatDifficulty(recipe.difficulty)}</span>
                </div>

                <div class="rating mb-2">
                    ${FormatUtils.formatRating(recipe.rating)}
                    <small class="text-muted ms-2">(${recipe.reviewCount} reviews)</small>
                </div>

                <div class="recipe-tags">
                    ${recipe.tags.slice(0, 3).map(tag => 
                        `<span class="recipe-tag">${tag}</span>`
                    ).join('')}
                </div>

                <div class="recipe-actions">
                    <a href="recipe-detail.html?id=${recipe.id}" class="btn btn-primary btn-sm">View Recipe</a>
                    <button class="favorite-btn ${favoriteClass}" data-recipe-id="${recipe.id}">
                        <i class="bi ${favoriteIcon}"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Setup favorite button
    const favoriteBtn = col.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleFavorite(this, recipe.id);
    });

    return col;
}

function toggleFavorite(button, recipeId) {
    const wasToggled = FavoritesManager.toggleFavorite(recipeId);
    
    if (wasToggled) {
        const icon = button.querySelector('i');
        const isFavorite = FavoritesManager.isFavorite(recipeId);
        
        // Update button appearance
        if (isFavorite) {
            icon.className = 'bi bi-heart-fill';
            button.classList.add('active');
            DOMUtils.showToast('Recipe added to favorites!', 'success');
        } else {
            icon.className = 'bi bi-heart';
            button.classList.remove('active');
            DOMUtils.showToast('Recipe removed from favorites!', 'info');
        }

        // Add animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

// Newsletter subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('form');
    if (newsletterForm && newsletterForm.querySelector('input[type="email"]')) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                DOMUtils.showToast('Thank you for subscribing! We\'ll send you the best recipes.', 'success');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }
});

// Add smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            DOMUtils.scrollToElement(target);
        }
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.card, .category-card').forEach(el => {
    observer.observe(el);
});