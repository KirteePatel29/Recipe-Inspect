// JavaScript for the meal planner page
document.addEventListener('DOMContentLoaded', function() {
    initializeMealPlannerPage();
});

let currentWeekStart = getWeekStart(new Date());
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const mealTypes = ['breakfast', 'lunch', 'dinner'];

function initializeMealPlannerPage() {
    setupMealPlannerActions();
    loadMealPlanner();
    loadRecipeSuggestions();
    updateCartCount();
    
    // Check if there's a recipe to add from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('recipe');
    if (recipeId) {
        // Pre-fill the add recipe modal
        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById('addRecipeModal'));
            modal.show();
            populateModalRecipes([getRecipeById(parseInt(recipeId))]);
        }, 500);
    }
}

function setupMealPlannerActions() {
    // Week navigation
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', () => {
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            loadMealPlanner();
        });
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', () => {
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            loadMealPlanner();
        });
    }

    // Generate shopping list
    const generateShoppingListBtn = document.getElementById('generateShoppingList');
    if (generateShoppingListBtn) {
        generateShoppingListBtn.addEventListener('click', generateShoppingListFromMealPlan);
    }

    // Clear meal plan
    const clearMealPlanBtn = document.getElementById('clearMealPlan');
    if (clearMealPlanBtn) {
        clearMealPlanBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the entire meal plan?')) {
                clearMealPlan();
            }
        });
    }

    // Recipe search in modal
    const recipeSearch = document.getElementById('recipeSearch');
    if (recipeSearch) {
        recipeSearch.addEventListener('input', debounce(searchModalRecipes, 300));
    }
}

function loadMealPlanner() {
    updateCurrentWeekDisplay();
    generateMealPlannerGrid();
}

function updateCurrentWeekDisplay() {
    const currentWeekElement = document.getElementById('currentWeek');
    if (currentWeekElement) {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const startStr = currentWeekStart.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        const endStr = weekEnd.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        currentWeekElement.textContent = `Week of ${startStr} - ${endStr}`;
    }
}

function generateMealPlannerGrid() {
    const container = document.getElementById('mealPlannerContent');
    if (!container) return;

    const mealPlan = MealPlannerManager.getMealPlan();
    let gridHTML = '';

    daysOfWeek.forEach((day, dayIndex) => {
        const currentDate = new Date(currentWeekStart);
        currentDate.setDate(currentWeekStart.getDate() + dayIndex);
        
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = currentDate.getDate();

        // Day header
        gridHTML += `
            <div class="meal-day">
                <div class="fw-bold">${dayName}</div>
                <div class="text-muted">${dayNumber}</div>
            </div>
        `;

        // Meal slots for this day
        mealTypes.forEach(meal => {
            const recipeId = mealPlan[day] && mealPlan[day][meal];
            const recipe = recipeId ? getRecipeById(recipeId) : null;

            gridHTML += `
                <div class="meal-slot ${recipe ? 'has-recipe' : ''}" 
                     data-day="${day}" data-meal="${meal}">
                    ${recipe ? `
                        <div class="meal-recipe">
                            <div class="meal-recipe-name">${recipe.name}</div>
                            <div class="meal-recipe-time">${FormatUtils.formatTime(recipe.totalTime)}</div>
                            <div class="mt-2">
                                <button class="btn btn-outline-primary btn-sm me-1" onclick="viewRecipe(${recipe.id})">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm" onclick="removeMeal('${day}', '${meal}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ` : `
                        <div class="text-muted text-center">
                            <i class="bi bi-plus-circle fs-4 mb-2"></i>
                            <div>Add Recipe</div>
                        </div>
                    `}
                </div>
            `;
        });
    });

    container.innerHTML = gridHTML;
    setupMealSlotActions();
}

function setupMealSlotActions() {
    const mealSlots = document.querySelectorAll('.meal-slot');
    
    mealSlots.forEach(slot => {
        if (!slot.classList.contains('has-recipe')) {
            slot.addEventListener('click', function() {
                const day = this.dataset.day;
                const meal = this.dataset.meal;
                openAddRecipeModal(day, meal);
            });
        }
    });
}

function openAddRecipeModal(day, meal) {
    const modal = new bootstrap.Modal(document.getElementById('addRecipeModal'));
    
    // Set selected day and meal
    document.getElementById('selectDay').value = day;
    document.getElementById('selectMeal').value = meal;
    
    // Load recipes for modal
    populateModalRecipes(RECIPES_DATA.slice(0, 6));
    
    modal.show();
}

function populateModalRecipes(recipes) {
    const container = document.getElementById('modalRecipeResults');
    if (!container) return;

    container.innerHTML = '';

    recipes.forEach(recipe => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        col.innerHTML = `
            <div class="card recipe-card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" style="height: 150px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="card-title">${recipe.name}</h6>
                    <div class="recipe-meta small">
                        <span><i class="bi bi-clock"></i> ${FormatUtils.formatTime(recipe.totalTime)}</span>
                        <span>${FormatUtils.formatDifficulty(recipe.difficulty)}</span>
                    </div>
                    <button class="btn btn-primary btn-sm w-100 mt-2" 
                            onclick="addRecipeToMealPlan(${recipe.id})">
                        Add to Plan
                    </button>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
}

function searchModalRecipes() {
    const searchTerm = document.getElementById('recipeSearch').value.trim();
    
    if (searchTerm.length === 0) {
        populateModalRecipes(RECIPES_DATA.slice(0, 6));
        return;
    }

    const results = searchRecipes(searchTerm);
    populateModalRecipes(results.slice(0, 6));
}

function addRecipeToMealPlan(recipeId) {
    const day = document.getElementById('selectDay').value;
    const meal = document.getElementById('selectMeal').value;

    if (!day || !meal) {
        DOMUtils.showToast('Please select a day and meal', 'error');
        return;
    }

    const success = MealPlannerManager.addMealToDay(day, meal, recipeId);
    
    if (success) {
        const recipe = getRecipeById(recipeId);
        DOMUtils.showToast(`${recipe.name} added to ${FormatUtils.capitalize(day)} ${meal}!`, 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addRecipeModal'));
        modal.hide();
        
        // Reload meal planner
        loadMealPlanner();
    } else {
        DOMUtils.showToast('Error adding recipe to meal plan', 'error');
    }
}

function removeMeal(day, meal) {
    const success = MealPlannerManager.removeMealFromDay(day, meal);
    
    if (success) {
        DOMUtils.showToast('Recipe removed from meal plan', 'success');
        loadMealPlanner();
    }
}

function viewRecipe(recipeId) {
    window.location.href = `recipe-detail.html?id=${recipeId}`;
}

function clearMealPlan() {
    MealPlannerManager.clearMealPlan();
    loadMealPlanner();
    DOMUtils.showToast('Meal plan cleared!', 'success');
}

function generateShoppingListFromMealPlan() {
    const mealRecipes = MealPlannerManager.getAllMealRecipes();
    
    if (mealRecipes.length === 0) {
        DOMUtils.showToast('No recipes in your meal plan to generate shopping list', 'info');
        return;
    }

    let addedCount = 0;
    mealRecipes.forEach(recipeId => {
        const success = ShoppingListManager.addIngredientsFromRecipe(recipeId);
        if (success) addedCount++;
    });

    if (addedCount > 0) {
        DOMUtils.showToast(`Shopping list generated! Added ingredients from ${addedCount} recipes.`, 'success');
        updateCartCount();
        // Redirect to shopping list after a short delay
        setTimeout(() => {
            window.location.href = 'shopping-list.html';
        }, 2000);
    } else {
        DOMUtils.showToast('Error generating shopping list', 'error');
    }
}

function loadRecipeSuggestions() {
    const container = document.getElementById('recipeSuggestions');
    if (!container) return;

    // Get some random recipe suggestions
    const suggestions = getFeaturedRecipes(6);
    
    container.innerHTML = '';

    suggestions.forEach(recipe => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        col.innerHTML = `
            <div class="card recipe-card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="card-title">${recipe.name}</h6>
                    <p class="card-text text-muted small">${recipe.description}</p>
                    <div class="recipe-meta small mb-2">
                        <span><i class="bi bi-clock"></i> ${FormatUtils.formatTime(recipe.totalTime)}</span>
                        <span>${FormatUtils.formatDifficulty(recipe.difficulty)}</span>
                    </div>
                    <div class="d-flex gap-1">
                        <a href="recipe-detail.html?id=${recipe.id}" class="btn btn-outline-primary btn-sm">
                            View Recipe
                        </a>
                        <button class="btn btn-primary btn-sm" onclick="quickAddRecipe(${recipe.id})">
                            Quick Add
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
}

function quickAddRecipe(recipeId) {
    // Open modal with this recipe pre-selected
    const modal = new bootstrap.Modal(document.getElementById('addRecipeModal'));
    populateModalRecipes([getRecipeById(recipeId)]);
    modal.show();
}

function updateCartCount() {
    FavoritesManager.updateCartCount();
}

// Utility function to get start of week (Monday)
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions global for onclick handlers
window.addRecipeToMealPlan = addRecipeToMealPlan;
window.removeMeal = removeMeal;
window.viewRecipe = viewRecipe;
window.quickAddRecipe = quickAddRecipe;