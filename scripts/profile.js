// JavaScript for the profile page
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

function initializeProfilePage() {
    loadFavoriteRecipes();
    loadRecentRecipes();
    updateProfileStats();
    setupProfileActions();
    updateCartCount();
}

function setupProfileActions() {
    // Clear favorites button
    const clearFavoritesBtn = document.getElementById('clearFavorites');
    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all favorites?')) {
                clearFavorites();
            }
        });
    }

    // Clear recent button
    const clearRecentBtn = document.getElementById('clearRecent');
    if (clearRecentBtn) {
        clearRecentBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear recent recipes?')) {
                clearRecentRecipes();
            }
        });
    }
}

function loadFavoriteRecipes() {
    const favoritesContainer = document.getElementById('favoriteRecipes');
    const favorites = FavoritesManager.getFavorites();

    if (!favoritesContainer) return;

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-heart display-1 text-muted"></i>
                <h5 class="mt-3">No Favorite Recipes Yet</h5>
                <p class="text-muted">Start exploring recipes and add them to your favorites!</p>
                <a href="recipes.html" class="btn btn-primary">Browse Recipes</a>
            </div>
        `;
        return;
    }

    favoritesContainer.innerHTML = '';

    favorites.forEach((recipeId, index) => {
        const recipe = getRecipeById(recipeId);
        if (recipe) {
            const recipeCard = createProfileRecipeCard(recipe, 'favorite');
            
            // Add animation delay
            setTimeout(() => {
                AnimationUtils.slideUp(recipeCard);
            }, index * 100);

            favoritesContainer.appendChild(recipeCard);
        }
    });
}

function loadRecentRecipes() {
    const recentContainer = document.getElementById('recentRecipes');
    const recent = RecentManager.getRecent();

    if (!recentContainer) return;

    if (recent.length === 0) {
        recentContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-clock-history display-1 text-muted"></i>
                <h5 class="mt-3">No Recent Recipes</h5>
                <p class="text-muted">Recipes you view will appear here for easy access.</p>
                <a href="recipes.html" class="btn btn-primary">Browse Recipes</a>
            </div>
        `;
        return;
    }

    recentContainer.innerHTML = '';

    recent.forEach((recipeId, index) => {
        const recipe = getRecipeById(recipeId);
        if (recipe) {
            const recipeCard = createProfileRecipeCard(recipe, 'recent');
            
            // Add animation delay
            setTimeout(() => {
                AnimationUtils.slideUp(recipeCard);
            }, index * 100);

            recentContainer.appendChild(recipeCard);
        }
    });
}

function createProfileRecipeCard(recipe, type) {
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

                <div class="recipe-actions">
                    <a href="recipe-detail.html?id=${recipe.id}" class="btn btn-primary btn-sm">View Recipe</a>
                    <div class="d-flex gap-1">
                        <button class="favorite-btn ${favoriteClass}" data-recipe-id="${recipe.id}" title="Toggle Favorite">
                            <i class="bi ${favoriteIcon}"></i>
                        </button>
                        ${type === 'favorite' ? `
                            <button class="btn btn-outline-danger btn-sm remove-favorite" data-recipe-id="${recipe.id}" title="Remove from Favorites">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                        ${type === 'recent' ? `
                            <button class="btn btn-outline-secondary btn-sm add-to-meal-plan" data-recipe-id="${recipe.id}" title="Add to Meal Plan">
                                <i class="bi bi-calendar-plus"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    setupCardActions(col, recipe, type);
    return col;
}

function setupCardActions(cardElement, recipe, type) {
    // Favorite button
    const favoriteBtn = cardElement.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFavorite(this, recipe.id);
        });
    }

    // Remove favorite button (only in favorites tab)
    const removeFavoriteBtn = cardElement.querySelector('.remove-favorite');
    if (removeFavoriteBtn) {
        removeFavoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            removeFavoriteRecipe(recipe.id, cardElement);
        });
    }

    // Add to meal plan button (only in recent tab)
    const addToMealPlanBtn = cardElement.querySelector('.add-to-meal-plan');
    if (addToMealPlanBtn) {
        addToMealPlanBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to meal planner with this recipe
            window.location.href = `meal-planner.html?recipe=${recipe.id}`;
        });
    }
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
            
            // If we're on the favorites tab, reload the favorites
            const favoritesTab = document.getElementById('favorites-tab');
            if (favoritesTab && favoritesTab.classList.contains('active')) {
                setTimeout(() => {
                    loadFavoriteRecipes();
                    updateProfileStats();
                }, 300);
            }
        }

        // Add animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

function removeFavoriteRecipe(recipeId, cardElement) {
    if (confirm('Remove this recipe from your favorites?')) {
        FavoritesManager.removeFavorite(recipeId);
        
        // Animate removal
        cardElement.style.transform = 'scale(0.8)';
        cardElement.style.opacity = '0';
        
        setTimeout(() => {
            loadFavoriteRecipes();
            updateProfileStats();
        }, 300);
        
        DOMUtils.showToast('Recipe removed from favorites!', 'success');
    }
}

function clearFavorites() {
    const favorites = FavoritesManager.getFavorites();
    favorites.forEach(recipeId => {
        FavoritesManager.removeFavorite(recipeId);
    });
    
    loadFavoriteRecipes();
    updateProfileStats();
    DOMUtils.showToast('All favorites cleared!', 'success');
}

function clearRecentRecipes() {
    RecentManager.clearRecent();
    loadRecentRecipes();
    updateProfileStats();
    DOMUtils.showToast('Recent recipes cleared!', 'success');
}

function updateProfileStats() {
    // Update favorite count
    const favoriteCountElement = document.getElementById('favoriteCount');
    if (favoriteCountElement) {
        const favoriteCount = FavoritesManager.getFavorites().length;
        favoriteCountElement.textContent = favoriteCount;
    }

    // Update review count (placeholder - would come from server in real app)
    const reviewCountElement = document.getElementById('reviewCount');
    if (reviewCountElement) {
        reviewCountElement.textContent = '0'; // Placeholder
    }

    // Update recipe count (recent recipes viewed)
    const recipeCountElement = document.getElementById('recipeCount');
    if (recipeCountElement) {
        const recentCount = RecentManager.getRecent().length;
        recipeCountElement.textContent = recentCount;
    }
}

function updateCartCount() {
    FavoritesManager.updateCartCount();
}