// JavaScript for the recipes page
document.addEventListener('DOMContentLoaded', function() {
    initializeRecipesPage();
});

let currentFilters = {
    categories: [],
    cuisines: [],
    dietary: [],
    time: null,
    query: ''
};

let currentSort = 'popularity';
let currentPage = 1;
const recipesPerPage = 12;

function initializeRecipesPage() {
    setupSearchAndFilters();
    loadInitialFilters();
    loadRecipes();
    updateCartCount();
}

function loadInitialFilters() {
    // Check for search query from session storage
    const searchQuery = sessionStorage.getItem('searchQuery');
    if (searchQuery) {
        currentFilters.query = searchQuery;
        document.getElementById('searchInput').value = searchQuery;
        sessionStorage.removeItem('searchQuery');
    }

    // Check for selected category from session storage
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (selectedCategory) {
        currentFilters.categories = [selectedCategory];
        const categoryCheckbox = document.getElementById(selectedCategory);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
        sessionStorage.removeItem('selectedCategory');
    }
}

function setupSearchAndFilters() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            loadRecipes();
        });
    }

    // Filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    currentFilters.query = searchInput.value.trim();
    currentPage = 1;
    loadRecipes();
}

function handleFilterChange() {
    // Collect all checked filters
    currentFilters.categories = getCheckedValues('breakfast,lunch,dinner,dessert,snack');
    currentFilters.cuisines = getCheckedValues('italian,mexican,asian,american,french');
    currentFilters.dietary = getCheckedValues('vegetarian,vegan,gluten-free,keto');
    
    // Time filters (radio-like behavior)
    const timeFilters = ['quick', 'medium', 'long'];
    const checkedTimeFilters = timeFilters.filter(time => {
        const checkbox = document.getElementById(time);
        return checkbox && checkbox.checked;
    });
    currentFilters.time = checkedTimeFilters.length > 0 ? checkedTimeFilters[0] : null;

    currentPage = 1;
    loadRecipes();
}

function getCheckedValues(filterIds) {
    return filterIds.split(',').filter(id => {
        const checkbox = document.getElementById(id);
        return checkbox && checkbox.checked;
    });
}

function clearAllFilters() {
    // Clear all checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    filterCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // Reset filters
    currentFilters = {
        categories: [],
        cuisines: [],
        dietary: [],
        time: null,
        query: ''
    };

    currentPage = 1;
    loadRecipes();
}

function loadRecipes() {
    const resultsContainer = document.getElementById('recipeResults');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');

    if (!resultsContainer) return;

    // Show loading state
    resultsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Finding delicious recipes...</p>
        </div>
    `;

    // Simulate loading delay
    setTimeout(() => {
        const filteredRecipes = filterRecipes(currentFilters);
        const sortedRecipes = sortRecipes(filteredRecipes, currentSort);
        
        // Update results info
        updateResultsInfo(sortedRecipes, resultsTitle, resultsCount);
        
        // Paginate results
        const totalPages = Math.ceil(sortedRecipes.length / recipesPerPage);
        const startIndex = (currentPage - 1) * recipesPerPage;
        const endIndex = startIndex + recipesPerPage;
        const recipesToShow = sortedRecipes.slice(startIndex, endIndex);
        
        // Display recipes
        displayRecipes(recipesToShow, resultsContainer);
        
        // Update pagination
        updatePagination(totalPages);
        
    }, 300);
}

function updateResultsInfo(recipes, titleElement, countElement) {
    if (titleElement) {
        let title = 'All Recipes';
        if (currentFilters.query) {
            title = `Search Results for "${currentFilters.query}"`;
        } else if (currentFilters.categories.length > 0) {
            title = `${FormatUtils.capitalize(currentFilters.categories[0])} Recipes`;
        }
        titleElement.textContent = title;
    }

    if (countElement) {
        const count = recipes.length;
        countElement.textContent = `${count} ${FormatUtils.pluralize('recipe', count)} found`;
    }
}

function displayRecipes(recipes, container) {
    if (recipes.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h4 class="mt-3">No recipes found</h4>
                <p class="text-muted">Try adjusting your filters or search terms.</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    recipes.forEach((recipe, index) => {
        const recipeCard = createRecipeCard(recipe);
        
        // Add animation delay
        setTimeout(() => {
            AnimationUtils.slideUp(recipeCard);
        }, index * 50);

        container.appendChild(recipeCard);
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

function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer || totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
        `;
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>';
        if (startPage > 2) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `
            <li class="page-item ${activeClass}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
            </li>
        `;
    }

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    loadRecipes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateCartCount() {
    FavoritesManager.updateCartCount();
}

// Make changePage function global for onclick handlers
window.changePage = changePage;