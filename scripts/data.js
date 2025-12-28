// Recipe data for the application
const RECIPES_DATA = [
    {
        id: 1,
        name: "Classic Chicken Parmesan",
        description: "Crispy breaded chicken breast topped with marinara sauce and melted mozzarella cheese.",
        category: "dinner",
        cuisine: "italian",
        prepTime: 20,
        cookTime: 25,
        totalTime: 45,
        servings: 4,
        difficulty: "medium",
        rating: 4.8,
        reviewCount: 234,
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
        ingredients: [
            "4 boneless, skinless chicken breasts",
            "1 cup all-purpose flour",
            "2 large eggs, beaten",
            "2 cups Italian seasoned breadcrumbs",
            "1/2 cup grated Parmesan cheese",
            "2 cups marinara sauce",
            "2 cups shredded mozzarella cheese",
            "1/4 cup olive oil",
            "Salt and pepper to taste",
            "Fresh basil for garnish"
        ],
        instructions: [
            "Preheat oven to 425°F (220°C).",
            "Pound chicken breasts to 1/2 inch thickness and season with salt and pepper.",
            "Set up breading station with flour, beaten eggs, and breadcrumbs mixed with Parmesan.",
            "Dredge chicken in flour, then egg, then breadcrumb mixture.",
            "Heat olive oil in a large skillet over medium-high heat.",
            "Cook chicken until golden brown, about 3-4 minutes per side.",
            "Transfer chicken to a baking dish and top with marinara sauce and mozzarella cheese.",
            "Bake for 15-20 minutes until cheese is melted and chicken is cooked through.",
            "Garnish with fresh basil and serve immediately."
        ],
        nutrition: {
            calories: 520,
            protein: 42,
            carbohydrates: 28,
            fat: 24,
            fiber: 3
        },
        tags: ["comfort-food", "family-dinner", "italian"],
        dietary: []
    },
    {
        id: 2,
        name: "Mediterranean Quinoa Salad",
        description: "Fresh and healthy quinoa salad with vegetables, feta cheese, and lemon vinaigrette.",
        category: "lunch",
        cuisine: "mediterranean",
        prepTime: 15,
        cookTime: 15,
        totalTime: 30,
        servings: 6,
        difficulty: "easy",
        rating: 4.6,
        reviewCount: 187,
        image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400",
        ingredients: [
            "1 1/2 cups quinoa",
            "3 cups vegetable broth",
            "1 cucumber, diced",
            "2 cups cherry tomatoes, halved",
            "1/2 red onion, finely chopped",
            "1/2 cup Kalamata olives, pitted and sliced",
            "1/2 cup crumbled feta cheese",
            "1/4 cup fresh parsley, chopped",
            "1/4 cup olive oil",
            "2 tablespoons lemon juice",
            "1 teaspoon oregano",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Rinse quinoa under cold water until water runs clear.",
            "Bring vegetable broth to a boil, add quinoa, reduce heat and simmer covered for 15 minutes.",
            "Remove from heat and let stand 5 minutes, then fluff with a fork.",
            "Let quinoa cool completely.",
            "In a large bowl, combine cooled quinoa, cucumber, tomatoes, red onion, olives, and feta.",
            "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.",
            "Pour dressing over salad and toss to combine.",
            "Add fresh parsley and toss again.",
            "Chill for at least 30 minutes before serving."
        ],
        nutrition: {
            calories: 285,
            protein: 10,
            carbohydrates: 38,
            fat: 12,
            fiber: 5
        },
        tags: ["healthy", "vegetarian", "mediterranean"],
        dietary: ["vegetarian", "gluten-free"]
    },
    {
        id: 3,
        name: "Chocolate Chip Cookies",
        description: "Classic homemade chocolate chip cookies that are crispy on the edges and chewy in the center.",
        category: "dessert",
        cuisine: "american",
        prepTime: 15,
        cookTime: 12,
        totalTime: 27,
        servings: 24,
        difficulty: "easy",
        rating: 4.9,
        reviewCount: 456,
        image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
        ingredients: [
            "2 1/4 cups all-purpose flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "1 cup butter, softened",
            "3/4 cup granulated sugar",
            "3/4 cup packed brown sugar",
            "2 large eggs",
            "2 teaspoons vanilla extract",
            "2 cups chocolate chips"
        ],
        instructions: [
            "Preheat oven to 375°F (190°C).",
            "In a medium bowl, whisk together flour, baking soda, and salt.",
            "In a large bowl, cream together butter and both sugars until light and fluffy.",
            "Beat in eggs one at a time, then add vanilla extract.",
            "Gradually mix in the flour mixture until just combined.",
            "Stir in chocolate chips.",
            "Drop rounded tablespoons of dough onto ungreased baking sheets.",
            "Bake for 9-11 minutes until golden brown around edges.",
            "Cool on baking sheet for 2 minutes, then transfer to wire rack."
        ],
        nutrition: {
            calories: 185,
            protein: 3,
            carbohydrates: 26,
            fat: 8,
            fiber: 1
        },
        tags: ["dessert", "cookies", "classic"],
        dietary: []
    },
    {
        id: 4,
        name: "Avocado Toast with Eggs",
        description: "Simple and nutritious breakfast with mashed avocado on toast topped with a perfectly cooked egg.",
        category: "breakfast",
        cuisine: "american",
        prepTime: 10,
        cookTime: 5,
        totalTime: 15,
        servings: 2,
        difficulty: "easy",
        rating: 4.5,
        reviewCount: 123,
        image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400",
        ingredients: [
            "2 slices whole grain bread",
            "1 ripe avocado",
            "2 large eggs",
            "1 tablespoon olive oil",
            "1 teaspoon lemon juice",
            "Salt and pepper to taste",
            "Red pepper flakes (optional)",
            "Fresh herbs for garnish"
        ],
        instructions: [
            "Toast bread slices until golden brown.",
            "While bread is toasting, heat olive oil in a non-stick pan.",
            "Crack eggs into the pan and cook to desired doneness.",
            "In a bowl, mash avocado with lemon juice, salt, and pepper.",
            "Spread mashed avocado evenly on toast.",
            "Top each slice with a cooked egg.",
            "Season with salt, pepper, and red pepper flakes if desired.",
            "Garnish with fresh herbs and serve immediately."
        ],
        nutrition: {
            calories: 320,
            protein: 15,
            carbohydrates: 22,
            fat: 20,
            fiber: 8
        },
        tags: ["healthy", "quick", "breakfast"],
        dietary: ["vegetarian"]
    },
    {
        id: 5,
        name: "Beef Stir Fry",
        description: "Quick and flavorful beef stir fry with mixed vegetables in a savory sauce.",
        category: "dinner",
        cuisine: "asian",
        prepTime: 15,
        cookTime: 10,
        totalTime: 25,
        servings: 4,
        difficulty: "medium",
        rating: 4.7,
        reviewCount: 198,
        image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400",
        ingredients: [
            "1 lb beef sirloin, sliced thin",
            "2 tablespoons vegetable oil",
            "1 bell pepper, sliced",
            "1 cup broccoli florets",
            "1 carrot, julienned",
            "2 cloves garlic, minced",
            "1 tablespoon fresh ginger, minced",
            "3 tablespoons soy sauce",
            "2 tablespoons oyster sauce",
            "1 tablespoon cornstarch",
            "1 teaspoon sesame oil",
            "2 green onions, sliced",
            "Sesame seeds for garnish"
        ],
        instructions: [
            "Marinate sliced beef in 1 tablespoon soy sauce and cornstarch for 10 minutes.",
            "Heat 1 tablespoon oil in a wok or large skillet over high heat.",
            "Add beef and stir-fry until browned, about 2-3 minutes. Remove and set aside.",
            "Heat remaining oil, add garlic and ginger, stir-fry for 30 seconds.",
            "Add vegetables and stir-fry for 3-4 minutes until crisp-tender.",
            "Return beef to the pan.",
            "Mix together remaining soy sauce, oyster sauce, and sesame oil.",
            "Pour sauce over beef and vegetables, toss to coat.",
            "Garnish with green onions and sesame seeds before serving."
        ],
        nutrition: {
            calories: 285,
            protein: 28,
            carbohydrates: 12,
            fat: 14,
            fiber: 3
        },
        tags: ["quick", "asian", "protein-rich"],
        dietary: []
    },
    {
        id: 6,
        name: "Greek Yogurt Parfait",
        description: "Layered parfait with Greek yogurt, fresh berries, and crunchy granola.",
        category: "breakfast",
        cuisine: "american",
        prepTime: 5,
        cookTime: 0,
        totalTime: 5,
        servings: 1,
        difficulty: "easy",
        rating: 4.4,
        reviewCount: 89,
        image: "https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=400",
        ingredients: [
            "1 cup Greek yogurt",
            "1/2 cup mixed berries",
            "1/4 cup granola",
            "1 tablespoon honey",
            "1 tablespoon chopped nuts (optional)",
            "Fresh mint for garnish"
        ],
        instructions: [
            "In a glass or bowl, add a layer of Greek yogurt.",
            "Add a layer of mixed berries.",
            "Sprinkle a layer of granola.",
            "Repeat layers as desired.",
            "Drizzle with honey on top.",
            "Garnish with chopped nuts and fresh mint if desired.",
            "Serve immediately."
        ],
        nutrition: {
            calories: 245,
            protein: 20,
            carbohydrates: 35,
            fat: 6,
            fiber: 4
        },
        tags: ["healthy", "quick", "protein-rich"],
        dietary: ["vegetarian", "gluten-free"]
    },
    {
        id: 7,
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil on homemade dough.",
        category: "dinner",
        cuisine: "italian",
        prepTime: 30,
        cookTime: 15,
        totalTime: 45,
        servings: 4,
        difficulty: "medium",
        rating: 4.8,
        reviewCount: 312,
        image: "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=400",
        ingredients: [
            "1 pizza dough (store-bought or homemade)",
            "1/2 cup pizza sauce",
            "8 oz fresh mozzarella, sliced",
            "2 large tomatoes, sliced",
            "1/4 cup fresh basil leaves",
            "2 tablespoons olive oil",
            "Salt and pepper to taste",
            "Cornmeal for dusting"
        ],
        instructions: [
            "Preheat oven to 475°F (245°C).",
            "Roll out pizza dough on a floured surface.",
            "Transfer to a pizza stone or baking sheet dusted with cornmeal.",
            "Brush dough with olive oil and spread pizza sauce evenly.",
            "Arrange mozzarella and tomato slices on top.",
            "Season with salt and pepper.",
            "Bake for 12-15 minutes until crust is golden and cheese is bubbly.",
            "Remove from oven and top with fresh basil leaves.",
            "Let cool for 2-3 minutes before slicing and serving."
        ],
        nutrition: {
            calories: 380,
            protein: 18,
            carbohydrates: 42,
            fat: 16,
            fiber: 3
        },
        tags: ["italian", "pizza", "vegetarian"],
        dietary: ["vegetarian"]
    },
    {
        id: 8,
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with creamy Caesar dressing, croutons, and Parmesan cheese.",
        category: "lunch",
        cuisine: "american",
        prepTime: 15,
        cookTime: 0,
        totalTime: 15,
        servings: 4,
        difficulty: "easy",
        rating: 4.3,
        reviewCount: 156,
        image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400",
        ingredients: [
            "2 heads romaine lettuce, chopped",
            "1/2 cup Caesar dressing",
            "1/2 cup grated Parmesan cheese",
            "1 cup croutons",
            "2 tablespoons lemon juice",
            "2 cloves garlic, minced",
            "2 anchovy fillets (optional)",
            "Black pepper to taste"
        ],
        instructions: [
            "Wash and dry romaine lettuce thoroughly.",
            "Chop lettuce into bite-sized pieces and place in a large bowl.",
            "If making dressing from scratch, combine garlic, anchovies, lemon juice in a small bowl.",
            "Add Caesar dressing to lettuce and toss well.",
            "Add half the Parmesan cheese and toss again.",
            "Top with croutons and remaining Parmesan cheese.",
            "Season with freshly ground black pepper.",
            "Serve immediately."
        ],
        nutrition: {
            calories: 185,
            protein: 8,
            carbohydrates: 12,
            fat: 12,
            fiber: 4
        },
        tags: ["salad", "classic", "vegetarian"],
        dietary: ["vegetarian"]
    }
];

// Categories for filtering
const RECIPE_CATEGORIES = [
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'dessert', name: 'Dessert' },
    { id: 'snack', name: 'Snacks' },
    { id: 'appetizer', name: 'Appetizers' }
];

// Cuisines for filtering
const RECIPE_CUISINES = [
    { id: 'american', name: 'American' },
    { id: 'italian', name: 'Italian' },
    { id: 'mexican', name: 'Mexican' },
    { id: 'asian', name: 'Asian' },
    { id: 'french', name: 'French' },
    { id: 'indian', name: 'Indian' },
    { id: 'mediterranean', name: 'Mediterranean' },
    { id: 'other', name: 'Other' }
];

// Dietary options
const DIETARY_OPTIONS = [
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'gluten-free', name: 'Gluten-Free' },
    { id: 'dairy-free', name: 'Dairy-Free' },
    { id: 'keto', name: 'Keto' },
    { id: 'low-carb', name: 'Low-Carb' }
];

// Ingredient categories for shopping list
const INGREDIENT_CATEGORIES = {
    'produce': 'Produce',
    'dairy': 'Dairy & Eggs',
    'meat': 'Meat & Seafood',
    'bakery': 'Bakery',
    'pantry': 'Pantry Staples',
    'frozen': 'Frozen Foods',
    'beverages': 'Beverages',
    'other': 'Other'
};

// Function to get recipes by category
function getRecipesByCategory(category) {
    return RECIPES_DATA.filter(recipe => recipe.category === category);
}

// Function to search recipes
function searchRecipes(query) {
    const searchTerm = query.toLowerCase();
    return RECIPES_DATA.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm)) ||
        recipe.tags.some(tag => tag.includes(searchTerm))
    );
}

// Function to get recipe by ID
function getRecipeById(id) {
    return RECIPES_DATA.find(recipe => recipe.id === parseInt(id));
}

// Function to filter recipes
function filterRecipes(filters) {
    return RECIPES_DATA.filter(recipe => {
        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(recipe.category)) return false;
        }
        
        // Cuisine filter
        if (filters.cuisines && filters.cuisines.length > 0) {
            if (!filters.cuisines.includes(recipe.cuisine)) return false;
        }
        
        // Dietary filter
        if (filters.dietary && filters.dietary.length > 0) {
            const hasMatchingDietary = filters.dietary.some(diet => recipe.dietary.includes(diet));
            if (!hasMatchingDietary) return false;
        }
        
        // Time filter
        if (filters.time) {
            if (filters.time === 'quick' && recipe.totalTime > 30) return false;
            if (filters.time === 'medium' && (recipe.totalTime <= 30 || recipe.totalTime > 60)) return false;
            if (filters.time === 'long' && recipe.totalTime <= 60) return false;
        }
        
        // Search query
        if (filters.query) {
            const searchTerm = filters.query.toLowerCase();
            const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
                recipe.description.toLowerCase().includes(searchTerm) ||
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm));
            if (!matchesSearch) return false;
        }
        
        return true;
    });
}

// Function to sort recipes
function sortRecipes(recipes, sortBy) {
    switch (sortBy) {
        case 'rating':
            return [...recipes].sort((a, b) => b.rating - a.rating);
        case 'time':
            return [...recipes].sort((a, b) => a.totalTime - b.totalTime);
        case 'difficulty':
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            return [...recipes].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        case 'popularity':
        default:
            return [...recipes].sort((a, b) => b.reviewCount - a.reviewCount);
    }
}

// Function to get featured recipes
function getFeaturedRecipes(limit = 6) {
    return RECIPES_DATA
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}