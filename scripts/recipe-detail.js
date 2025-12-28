// JavaScript for the recipe detail page
document.addEventListener('DOMContentLoaded', function() {
    initializeRecipeDetailPage();
});

function initializeRecipeDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (recipeId) {
        loadRecipeDetail(parseInt(recipeId));
    } else {
        showRecipeNotFound();
    }
    
    updateCartCount();
}

function loadRecipeDetail(recipeId) {
    const recipe = getRecipeById(recipeId);
    
    if (!recipe) {
        showRecipeNotFound();
        return;
    }
    
    // Add to recent recipes
    RecentManager.addRecent(recipeId);
    
    // Display recipe
    displayRecipeDetail(recipe);
}

function showRecipeNotFound() {
    const container = document.getElementById('recipeContent');
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-exclamation-triangle display-1 text-muted"></i>
            <h2 class="mt-3">Recipe Not Found</h2>
            <p class="text-muted">The recipe you're looking for doesn't exist or may have been removed.</p>
            <a href="recipes.html" class="btn btn-primary">Browse All Recipes</a>
        </div>
    `;
}

function displayRecipeDetail(recipe) {
    const container = document.getElementById('recipeContent');
    const isFavorite = FavoritesManager.isFavorite(recipe.id);
    
    container.innerHTML = `
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item"><a href="recipes.html">Recipes</a></li>
                <li class="breadcrumb-item active">${recipe.name}</li>
            </ol>
        </nav>

        <!-- Recipe Header -->
        <div class="row mb-5">
            <div class="col-lg-6">
                <img src="${recipe.image}" alt="${recipe.name}" class="img-fluid rounded-3 shadow-lg">
            </div>
            <div class="col-lg-6">
                <div class="recipe-header">
                    <h1 class="mb-3">${recipe.name}</h1>
                    <p class="lead text-muted mb-4">${recipe.description}</p>
                    
                    <div class="row g-3 mb-4">
                        <div class="col-6 col-sm-3">
                            <div class="text-center p-3 bg-light rounded">
                                <i class="bi bi-clock text-primary fs-4"></i>
                                <div class="fw-bold mt-2">${FormatUtils.formatTime(recipe.totalTime)}</div>
                                <small class="text-muted">Total Time</small>
                            </div>
                        </div>
                        <div class="col-6 col-sm-3">
                            <div class="text-center p-3 bg-light rounded">
                                <i class="bi bi-people text-primary fs-4"></i>
                                <div class="fw-bold mt-2">${recipe.servings}</div>
                                <small class="text-muted">Servings</small>
                            </div>
                        </div>
                        <div class="col-6 col-sm-3">
                            <div class="text-center p-3 bg-light rounded">
                                <i class="bi bi-speedometer2 text-primary fs-4"></i>
                                <div class="fw-bold mt-2">${FormatUtils.capitalize(recipe.difficulty)}</div>
                                <small class="text-muted">Difficulty</small>
                            </div>
                        </div>
                        <div class="col-6 col-sm-3">
                            <div class="text-center p-3 bg-light rounded">
                                <i class="bi bi-star-fill text-accent fs-4"></i>
                                <div class="fw-bold mt-2">${recipe.rating}</div>
                                <small class="text-muted">${recipe.reviewCount} reviews</small>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mb-3">
                        <button class="btn btn-primary flex-grow-1" id="favoriteBtn" data-recipe-id="${recipe.id}">
                            <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                            ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                        <button class="btn btn-secondary" id="addToShoppingList" data-recipe-id="${recipe.id}">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                        <button class="btn btn-outline-secondary" id="shareRecipe">
                            <i class="bi bi-share"></i>
                        </button>
                    </div>

                    <div class="recipe-tags">
                        ${recipe.tags.map(tag => `<span class="badge bg-accent me-1 mb-1">${tag}</span>`).join('')}
                        ${recipe.dietary.map(diet => `<span class="badge bg-success me-1 mb-1">${diet}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- Recipe Content Tabs -->
        <ul class="nav nav-tabs mb-4" id="recipeTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="ingredients-tab" data-bs-toggle="tab" data-bs-target="#ingredients" type="button" role="tab">
                    <i class="bi bi-list-ul me-2"></i>Ingredients
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="instructions-tab" data-bs-toggle="tab" data-bs-target="#instructions" type="button" role="tab">
                    <i class="bi bi-list-ol me-2"></i>Instructions
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="nutrition-tab" data-bs-toggle="tab" data-bs-target="#nutrition" type="button" role="tab">
                    <i class="bi bi-heart-pulse me-2"></i>Nutrition
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">
                    <i class="bi bi-chat-square-text me-2"></i>Reviews
                </button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content" id="recipeTabContent">
            <!-- Ingredients Tab -->
            <div class="tab-pane fade show active" id="ingredients" role="tabpanel">
                <div class="row">
                    <div class="col-lg-8">
                        <h4 class="mb-3">Ingredients</h4>
                        <div class="card">
                            <div class="card-body">
                                <ul class="list-unstyled ingredients-list">
                                    ${recipe.ingredients.map((ingredient, index) => `
                                        <li class="ingredient-item py-2">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="ingredient-${index}">
                                                <label class="form-check-label" for="ingredient-${index}">
                                                    ${ingredient}
                                                </label>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0">Recipe Info</h6>
                            </div>
                            <div class="card-body">
                                <div class="row text-center">
                                    <div class="col-6 mb-3">
                                        <div class="fw-bold text-primary">${recipe.prepTime}min</div>
                                        <small class="text-muted">Prep Time</small>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <div class="fw-bold text-secondary">${recipe.cookTime}min</div>
                                        <small class="text-muted">Cook Time</small>
                                    </div>
                                </div>
                                <p class="small text-muted mb-3"><strong>Cuisine:</strong> ${FormatUtils.capitalize(recipe.cuisine)}</p>
                                <p class="small text-muted mb-3"><strong>Category:</strong> ${FormatUtils.capitalize(recipe.category)}</p>
                                <button class="btn btn-outline-primary w-100" id="addAllToShoppingList" data-recipe-id="${recipe.id}">
                                    <i class="bi bi-cart-plus me-2"></i>Add All to Shopping List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Instructions Tab -->
            <div class="tab-pane fade" id="instructions" role="tabpanel">
                <h4 class="mb-3">Instructions</h4>
                <div class="instructions-list">
                    ${recipe.instructions.map((instruction, index) => `
                        <div class="instruction-step mb-4">
                            <div class="d-flex">
                                <div class="step-number">
                                    <span class="badge bg-primary rounded-circle fs-5">${index + 1}</span>
                                </div>
                                <div class="step-content ms-3">
                                    <p class="mb-0">${instruction}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Nutrition Tab -->
            <div class="tab-pane fade" id="nutrition" role="tabpanel">
                <h4 class="mb-3">Nutrition Information</h4>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">Per Serving</h6>
                                <div class="nutrition-info">
                                    <div class="d-flex justify-content-between py-2 border-bottom">
                                        <span>Calories</span>
                                        <strong>${recipe.nutrition.calories} kcal</strong>
                                    </div>
                                    <div class="d-flex justify-content-between py-2 border-bottom">
                                        <span>Protein</span>
                                        <strong>${recipe.nutrition.protein}g</strong>
                                    </div>
                                    <div class="d-flex justify-content-between py-2 border-bottom">
                                        <span>Carbohydrates</span>
                                        <strong>${recipe.nutrition.carbohydrates}g</strong>
                                    </div>
                                    <div class="d-flex justify-content-between py-2 border-bottom">
                                        <span>Fat</span>
                                        <strong>${recipe.nutrition.fat}g</strong>
                                    </div>
                                    <div class="d-flex justify-content-between py-2">
                                        <span>Fiber</span>
                                        <strong>${recipe.nutrition.fiber}g</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">Dietary Information</h6>
                                <div class="dietary-badges">
                                    ${recipe.dietary.length > 0 ? 
                                        recipe.dietary.map(diet => 
                                            `<span class="badge bg-success me-2 mb-2">${FormatUtils.capitalize(diet)}</span>`
                                        ).join('') 
                                        : '<p class="text-muted">No specific dietary restrictions</p>'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reviews Tab -->
            <div class="tab-pane fade" id="reviews" role="tabpanel">
                <div class="row">
                    <div class="col-lg-8">
                        <h4 class="mb-3">Reviews & Ratings</h4>
                        
                        <!-- Add Review Form -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h6 class="mb-0">Write a Review</h6>
                            </div>
                            <div class="card-body">
                                <form id="reviewForm">
                                    <div class="mb-3">
                                        <label class="form-label">Rating</label>
                                        <div class="rating-input">
                                            ${[1,2,3,4,5].map(star => `
                                                <input type="radio" name="rating" value="${star}" id="star${star}">
                                                <label for="star${star}" class="star-label">
                                                    <i class="bi bi-star"></i>
                                                </label>
                                            `).join('')}
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reviewText" class="form-label">Your Review</label>
                                        <textarea class="form-control" id="reviewText" rows="3" 
                                                  placeholder="Share your experience with this recipe..."></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Submit Review</button>
                                </form>
                            </div>
                        </div>

                        <!-- Reviews List -->
                        <div id="reviewsList">
                            <div class="text-center text-muted py-4">
                                <i class="bi bi-chat-square-text display-4"></i>
                                <p class="mt-3">No reviews yet. Be the first to review this recipe!</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <div class="display-4 text-primary mb-2">${recipe.rating}</div>
                                <div class="rating mb-2">
                                    ${FormatUtils.formatRating(recipe.rating)}
                                </div>
                                <p class="text-muted mb-0">Based on ${recipe.reviewCount} reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Setup event listeners
    setupRecipeActions(recipe);
}

function setupRecipeActions(recipe) {
    // Favorite button
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            toggleRecipeFavorite(recipe.id, this);
        });
    }

    // Add all to shopping list
    const addAllBtn = document.getElementById('addAllToShoppingList');
    if (addAllBtn) {
        addAllBtn.addEventListener('click', function() {
            addAllIngredientsToShoppingList(recipe.id);
        });
    }

    // Share button
    const shareBtn = document.getElementById('shareRecipe');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            shareRecipe(recipe);
        });
    }

    // Review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview(recipe.id);
        });
    }

    // Ingredient checkboxes
    setupIngredientCheckboxes();
}

function toggleRecipeFavorite(recipeId, button) {
    const wasToggled = FavoritesManager.toggleFavorite(recipeId);
    
    if (wasToggled) {
        const icon = button.querySelector('i');
        const isFavorite = FavoritesManager.isFavorite(recipeId);
        
        if (isFavorite) {
            icon.className = 'bi bi-heart-fill';
            button.innerHTML = '<i class="bi bi-heart-fill"></i> Remove from Favorites';
            DOMUtils.showToast('Recipe added to favorites!', 'success');
        } else {
            icon.className = 'bi bi-heart';
            button.innerHTML = '<i class="bi bi-heart"></i> Add to Favorites';
            DOMUtils.showToast('Recipe removed from favorites!', 'info');
        }
    }
}

function addAllIngredientsToShoppingList(recipeId) {
    const success = ShoppingListManager.addIngredientsFromRecipe(recipeId);
    if (success) {
        DOMUtils.showToast('All ingredients added to shopping list!', 'success');
        updateCartCount();
    } else {
        DOMUtils.showToast('Error adding ingredients to shopping list', 'error');
    }
}

function shareRecipe(recipe) {
    if (navigator.share) {
        navigator.share({
            title: recipe.name,
            text: recipe.description,
            url: window.location.href
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        DOMUtils.showToast('Recipe link copied to clipboard!', 'success');
    }).catch(() => {
        DOMUtils.showToast('Unable to share recipe', 'error');
    });
}

function setupIngredientCheckboxes() {
    const checkboxes = document.querySelectorAll('.ingredients-list input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.6';
            } else {
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
            }
        });
    });
}

function submitReview(recipeId) {
    const rating = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('reviewText').value.trim();
    
    if (!rating) {
        DOMUtils.showToast('Please select a rating', 'error');
        return;
    }
    
    if (!reviewText) {
        DOMUtils.showToast('Please write a review', 'error');
        return;
    }
    
    // In a real app, this would send to a server
    DOMUtils.showToast('Thank you for your review!', 'success');
    document.getElementById('reviewForm').reset();
}

function updateCartCount() {
    FavoritesManager.updateCartCount();
}