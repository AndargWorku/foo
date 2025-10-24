export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Ingredient {
  id: string;
  recipeId: string;
  name: string;
}

export interface Step {
  id: string;
  recipeId: string;
  stepNumber: number;
  description: string;
}

export interface Comment {
    id: string;
    text: string;
    userId: string;
    recipeId: string;
    createdAt: string;
    user?: User;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  userId: string;
  categoryId: string;
  prepTime: number;
  featuredImage: string;
  images: string[];
  createdAt: string;
  user?: User;
  category?: Category;
  ingredients?: Ingredient[];
  steps?: Step[];
   user_purchased_recipes_aggregate?: { // Added for premium access
    aggregate: {
      count: number;
    };
  };
}




// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   password?: string; // Only available on server
// }

// export interface Category {
//   id: string;
//   name: string;
//   slug: string;
// }

// export interface Ingredient {
//   id: string;
//   recipeId: string;
//   name: string;
// }

// export interface Step {
//   id: string;
//   recipeId: string;
//   stepNumber: number;
//   description: string;
// }

// export interface Recipe {
//   id: string;
//   title: string;
//   description: string;
//   userId: string;
//   categoryId: string;
//   prepTime: number;
//   featuredImage: string;
//   images: string[];
//   createdAt: string;
//   // -> These properties will be added by the server API
//   user?: User;
//   category?: Category;
//   ingredients?: Ingredient[];
//   steps?: Step[];
// }