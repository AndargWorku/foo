
import { gql } from '@apollo/client/core';


export const USER_PROFILE_FRAGMENT = gql`
  fragment UserProfile on users {
    id
    username
    photo_url
  }
`;


export const RECIPE_CARD_FRAGMENT = gql`
  fragment RecipeCard on recipes {
    id
    title
    featured_image_url
    created_at
    average_rating
    total_likes
    is_premium
    user {
      ...UserProfile
    }
    recipe_categories(limit: 1) {
      category {
        id
        name
        slug
      }
    }
  }
  ${USER_PROFILE_FRAGMENT}
`;

export const RECIPE_DETAIL_FRAGMENT = gql`
  fragment RecipeDetail on recipes {
    id
    title
    description
    prep_time_minutes
    cook_time_minutes
    servings
    created_at
    featured_image_url
    is_premium
    price
    average_rating
    total_likes
    total_comments
    user {
      ...UserProfile
    }
    recipe_images {
      id
      image_url
      is_featured
    }
    instructions(order_by: { step_number: asc }) {
      id
      step_number
      description
    }
    recipe_ingredients(order_by: { id: asc }) {
      id
      quantity
      unit
      ingredient {
        id
        name
      }
    }
    recipe_categories {
      category {
        id
        name
        slug
      }
    }
  }
  ${USER_PROFILE_FRAGMENT}
`;

export const GET_RECIPE_DETAILS = gql`
  query GetRecipeDetails($id: uuid!, $user_id: uuid, $isLoggedIn: Boolean!) {
    recipes_by_pk(id: $id) {
      ...RecipeDetail
      recipe_likes_aggregate(where: { user_id: { _eq: $user_id } }) @include(if: $isLoggedIn) { aggregate { count } }
      user_bookmarks_aggregate(where: { user_id: { _eq: $user_id } }) @include(if: $isLoggedIn) { aggregate { count } }
      recipe_ratings(where: {user_id: {_eq: $user_id}}) @include(if: $isLoggedIn) { rating }
      user_purchased_recipes_aggregate(where: { user_id: { _eq: $user_id } }) @include(if: $isLoggedIn) { aggregate { count } }
      recipe_ratings_aggregate { aggregate { count } }
    }
  }
  ${RECIPE_DETAIL_FRAGMENT}
`;

export const GET_RECIPES = gql`
  query GetRecipes(
    $limit: Int = 10
    $offset: Int = 0
    $orderBy: [recipes_order_by!]
    $where: recipes_bool_exp
  ) {
    recipes(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
      ...RecipeCard
      prep_time_minutes
      user {
        ...UserProfile
      }
      recipe_ingredients {
        ingredient {
          id
          name
        }
      }
    }
  }
  ${RECIPE_CARD_FRAGMENT}
  ${USER_PROFILE_FRAGMENT}
`;

export const GET_USER_PROFILE_DATA = gql`
  query GetUserProfileData($username: String!) {
    users(where: { username: { _eq: $username } }) {
      id
      username
      photo_url
      recipes(order_by: { created_at: desc }) {
        ...RecipeCard
      }
      user_bookmarks(order_by: { recipe: { created_at: desc } }) {
        recipe {
          ...RecipeCard
        }
      }
      recipes_aggregate {
        aggregate {
          count
          sum {
            total_likes
          }
        }
      }
    }
  }
  ${RECIPE_CARD_FRAGMENT}
`;

export const GET_RECIPE_COMMENTS = gql`
  query GetRecipeComments($recipe_id: uuid!) {
    comments(where: { recipe_id: { _eq: $recipe_id } }, order_by: { created_at: desc }) {
      id
      content
      created_at
      user {
        ...UserProfile
      }
    }
  }
  ${USER_PROFILE_FRAGMENT}
`;

export const GET_ALL_CATEGORIES_WITH_COUNT = gql`
  query GetAllCategoriesWithCount {
    categories(order_by: { name: asc }) {
      id
      name
      slug
      recipes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_ALL_INGREDIENTS = gql`
    query GetAllIngredients {
        ingredients(order_by: {name: asc}) {
            id
            name
        }
    }
`;

export const FETCH_CATEGORIES = gql`
  query FetchCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_ALL_CREATORS = gql`
  query GetAllCreators {
    users(where: { recipes: {} }, order_by: { username: asc }) {
      id
      username
      recipes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_MY_PROFILE_FOR_EDIT = gql`
  query GetMyProfileForEdit {
    users {
      id
      username
      email
    }
  }
`;

export const GET_CURRENT_USER_PROFILE = gql`
  query GetCurrentUserProfile {
    users {
      id
      username
      email
    }
  }
`;

export const FILTER_RECIPES_BY_INGREDIENTS = gql`
  query FilterRecipesByIngredients($ingredients: [String!]!) {
    filter_recipes_by_ingredients(args: { ingredient_names: $ingredients }) {
      ...RecipeCard
    }
  }
  ${RECIPE_CARD_FRAGMENT}
`;

export const GET_USER_UNIQUE_CATEGORIES = gql`
  query GetUserUniqueCategories($userId: uuid!) {
    recipe_categories(
      where: { recipe: { user_id: { _eq: $userId } } }
      distinct_on: category_id
    ) {
      category {
        id
        name
        slug
        recipes(where: { user_id: { _eq: $userId } }) {
          id
          title
        }
      }
    }
  }
`;

export const GET_USER_UNIQUE_INGREDIENTS = gql`
  query GetUserUniqueIngredients($userId: uuid!) {
    recipe_ingredients(
      where: { recipe: { user_id: { _eq: $userId } } },
      distinct_on: ingredient_id
    ) {
      ingredient {
        id
        name
      }
    }
  }
`;


// export const GET_USER_PURCHASE_HISTORY = gql`
//   query GetUserPurchaseHistory($userId: uuid!, $limit: Int!, $offset: Int!) {
//     user_purchased_recipes(
//       where: { user_id: { _eq: $userId } }
//       order_by: { purchased_at: desc }
//       limit: $limit
//       offset: $offset
//     ) {
//       id
//       purchased_at
//       amount_paid
//       currency
//       recipe {
//         id
//         title
//         user {
//           username
//         }
//       }
//     }
//     user_purchased_recipes_aggregate(where: { user_id: { _eq: $userId } }) {
//       aggregate {
//         count
//       }
//     }
//   }
// `;



export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
     token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: uuid!, $_set: users_set_input!) {
    update_users_by_pk(pk_columns: {id: $id}, _set: $_set) {
      id
      username
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation CreateRecipe($object: recipes_insert_input!) {
    insert_recipes_one(object: $object) {
      id
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe(
    $id: uuid!,
    $recipeData: recipes_set_input!,
    $categories: [recipe_categories_insert_input!]!,
    $ingredients: [recipe_ingredients_insert_input!]!,
    $instructions: [instructions_insert_input!]!,
    $images: [recipe_images_insert_input!]!
  ) {
    delete_recipe_categories(where: {recipe_id: {_eq: $id}}) { affected_rows }
    delete_recipe_ingredients(where: {recipe_id: {_eq: $id}}) { affected_rows }
    delete_instructions(where: {recipe_id: {_eq: $id}}) { affected_rows }
    delete_recipe_images(where: {recipe_id: {_eq: $id}}) { affected_rows }
    update_recipes_by_pk(pk_columns: {id: $id}, _set: $recipeData) { id }
    insert_recipe_categories(objects: $categories) { affected_rows }
    insert_recipe_ingredients(objects: $ingredients) { affected_rows }
    insert_instructions(objects: $instructions) { affected_rows }
    insert_recipe_images(objects: $images) { affected_rows }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: uuid!) {
    delete_recipes_by_pk(id: $id) {
      id
    }
  }
`;

export const LIKE_RECIPE = gql`
  mutation LikeRecipe($recipe_id: uuid!) {
    insert_recipe_likes_one(object: { recipe_id: $recipe_id }) {
      recipe_id
    }
  }
`;

export const UNLIKE_RECIPE = gql`
  mutation UnlikeRecipe($recipe_id: uuid!, $user_id: uuid!) {
    delete_recipe_likes_by_pk(recipe_id: $recipe_id, user_id: $user_id) {
      recipe_id
    }
  }
`;

export const BOOKMARK_RECIPE = gql`
  mutation BookmarkRecipe($recipe_id: uuid!) {
    insert_user_bookmarks_one(object: { recipe_id: $recipe_id }) {
      recipe_id
    }
  }
`;

export const UNBOOKMARK_RECIPE = gql`
  mutation UnbookmarkRecipe($recipe_id: uuid!, $user_id: uuid!) {
    delete_user_bookmarks_by_pk(recipe_id: $recipe_id, user_id: $user_id) {
      recipe_id
    }
  }
`;

export const RATE_RECIPE = gql`
  mutation RateRecipe($recipe_id: uuid!, $rating: Int!) {
    insert_recipe_ratings_one(
      object: { recipe_id: $recipe_id, rating: $rating },
      on_conflict: { constraint: recipe_ratings_pkey, update_columns: [rating] }
    ) {
      rating
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($recipe_id: uuid!, $content: String!) {
    insert_comments_one(object: { recipe_id: $recipe_id, content: $content }) {
      id
      created_at
      content
      user {
        ...UserProfile
      }
    }
  }
  ${USER_PROFILE_FRAGMENT}
`;

export const INITIATE_PAYMENT = gql`
  mutation InitiatePayment($recipeId: uuid!) {
    initiatePayment(recipeId: $recipeId) {
      checkoutUrl
    }
  }
`;

export const UPLOAD_IMAGE_ACTION = gql`
  mutation UploadImage($imageDataBase64: String!, $filename: String!) {
    uploadImage(imageDataBase64: $imageDataBase64, filename: $filename) {
      imageUrl
    }
  }
`;

export const FIND_OR_CREATE_CATEGORY = gql`
  mutation FindOrCreateCategory($name: String!) {
    find_or_create_category(args: { category_name: $name }) {
      id
      name
    }
  }
`;

export const FIND_OR_CREATE_INGREDIENT = gql`
  mutation FindOrCreateIngredient($name: String!) {
    find_or_create_ingredient(args: { ingredient_name: $name }) {
      id
      name
    }
  }
`;





// import { gql } from '@apollo/client/core';


// export const USER_PROFILE_FRAGMENT = gql`
//   fragment UserProfile on users {
//     id
//     username
//     photo_url
//   }
// `;

// export const RECIPE_CARD_FRAGMENT = gql`
//   fragment RecipeCard on recipes {
//     id
//     title
//     featured_image_url
//     created_at
//     average_rating
//     total_likes
//     user {
//       ...UserProfile
//     }
//     recipe_categories(limit: 1) {
//       category {
//         id
//         name
//         slug
//       }
//     }
//   }
//   ${USER_PROFILE_FRAGMENT}
// `;

// export const RECIPE_DETAIL_FRAGMENT = gql`
//   fragment RecipeDetail on recipes {
//     id
//     title
//     description
//     prep_time_minutes
//     cook_time_minutes
//     servings
//     created_at
//     featured_image_url
//     is_premium
//     price
//     average_rating
//     total_likes
//     total_comments
//     user {
//       ...UserProfile
//     }
//     recipe_images {
//       id
//       image_url
//       is_featured
//     }
//     instructions(order_by: { step_number: asc }) {
//       id
//       step_number
//       description
//     }
//     recipe_ingredients(order_by: { id: asc }) {
//       id
//       quantity
//       unit
//       ingredient {
//         id
//         name
//       }
//     }
//     recipe_categories {
//       category {
//         id
//         name
//         slug
//       }
//     }
//   }
//   ${USER_PROFILE_FRAGMENT}
// `;


// export const GET_ALL_CREATORS = gql`
//   query GetAllCreators {
//     users(
//       where: { recipes: {} }, 
//       order_by: { username: asc }
//     ) {
//       id
//       username
//       recipes_aggregate {
//         aggregate {
//           count
//         }
//       }
//     }
//   }
// `;

// export const UPDATE_USER_PROFILE = gql`
//   mutation UpdateUserProfile($id: uuid!, $_set: users_set_input!) {
//     update_users_by_pk(pk_columns: {id: $id}, _set: $_set) {
//       id
//       username
//     }
//   }
// `;

// export const GET_MY_PROFILE_FOR_EDIT = gql`
//   query GetMyProfileForEdit {
//     users {
//       id
//       username
//       email
//     }
//   }
// `;

// export const GET_USER_PROFILE_DATA = gql`
//   query GetUserProfileData($username: String!) {
//     users(where: { username: { _eq: $username } }) {
//       id
//       username
//       photo_url
//       recipes(order_by: { created_at: desc }) {
//         ...RecipeCard
//       }
//       user_bookmarks(order_by: { recipe: { created_at: desc } }) {
//         recipe {
//           ...RecipeCard
//         }
//       }
//       recipes_aggregate {
//         aggregate {
//           count
//           sum {
//             total_likes
//           }
//         }
//       }
//     }
//   }
//   ${RECIPE_CARD_FRAGMENT}
// `;

// export const GET_CURRENT_USER_PROFILE = gql`
//   query GetCurrentUserProfile {
//     users {
//       id
//       username
//       email
      
//     }
//   }
// `;

// export const GET_RECIPES = gql`
//   query GetRecipes(
//     $limit: Int = 10
//     $offset: Int = 0
//     $orderBy: [recipes_order_by!]
//     $where: recipes_bool_exp
//   ) {
//     recipes(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
//       id
//       title
//       featured_image_url
//       prep_time_minutes
//       total_likes
//       average_rating
//        is_premium 
//       user {
//         id
//         username
//         photo_url
//       }
//       recipe_categories {
//         category {
//           id
//           name
//           slug
//         }
//       }
//       recipe_ingredients {
//         ingredient {
//           id
//           name
//         }
//       }
//     }
//   }
// `;


// export const GET_RECIPE_COMMENTS = gql`
//   query GetRecipeComments($recipe_id: uuid!) {
//     comments(where: { recipe_id: { _eq: $recipe_id } }, order_by: { created_at: desc }) {
//       id
//       content
//       created_at
//       user {
//         ...UserProfile
//       }
//     }
//   }
//   ${USER_PROFILE_FRAGMENT}
// `;

// export const GET_ALL_CATEGORIES_WITH_COUNT = gql`
//   query GetAllCategoriesWithCount {
//     categories(order_by: { name: asc }) {
//       id
//       name
//       slug
//       recipes_aggregate {
//         aggregate {
//           count
//         }
//       }
//     }
//   }
// `;

// export const GET_ALL_INGREDIENTS = gql`
//     query GetAllIngredients {
//         ingredients(order_by: {name: asc}) {
//             id
//             name
//         }
//     }
// `;

// export const FILTER_RECIPES_BY_INGREDIENTS = gql`
//   query FilterRecipesByIngredients($ingredients: [String!]!) {
//     filter_recipes_by_ingredients(args: { ingredient_names: $ingredients }) {
//       ...RecipeCard
//     }
//   }
//   ${RECIPE_CARD_FRAGMENT}
// `;

// export const GET_USER_UNIQUE_CATEGORIES = gql`
//   query GetUserUniqueCategories($userId: uuid!) {
//     recipe_categories(
//       where: { recipe: { user_id: { _eq: $userId } } }
//       distinct_on: category_id
//     ) {
//       category {
//         id
//         name
//         slug
//         recipes(where: { user_id: { _eq: $userId } }) {
//           id
//           title
//           description
//           created_at
//           updated_at
//         }
//       }
//     }
//   }
// `;


// export const GET_USER_UNIQUE_INGREDIENTS = gql`
//   query GetUserUniqueIngredients($userId: uuid!) {
//     recipe_ingredients(
//       where: { recipe: { user_id: { _eq: $userId } } },
//       distinct_on: ingredient_id
//     ) {
//       ingredient {
//         id
//         name
//       }
//     }
//   }
// `;

// export const FETCH_CATEGORIES = gql`
//   query FetchCategories {
//     categories {
//       id
//       name
//     }
//   }
// `;

// export const REGISTER_USER = gql`
//   mutation RegisterUser($username: String!, $email: String!, $password: String!) {
//     register(username: $username, email: $email, password: $password) {
//      token
//     }
//   }
// `;

// export const LOGIN_USER = gql`
//   mutation Login($email: String!, $password: String!) {
//     login(email: $email, password: $password) {
//       token
//     }
//   }
// `;

// export const UPLOAD_IMAGE_ACTION = gql`
//   mutation UploadImage($imageDataBase64: String!, $filename: String!) {
//     uploadImage(imageDataBase64: $imageDataBase64, filename: $filename) {
//       imageUrl
//     }
//   }
// `;

// export const FIND_OR_CREATE_CATEGORY = gql`
//   mutation FindOrCreateCategory($name: String!) {
//     find_or_create_category(args: { category_name: $name }) {
//       id
//       name
//     }
//   }
// `;

// export const FIND_OR_CREATE_INGREDIENT = gql`
//   mutation FindOrCreateIngredient($name: String!) {
//     find_or_create_ingredient(args: { ingredient_name: $name }) {
//       id
//       name
//     }
//   }
// `;


// export const CREATE_RECIPE = gql`
//   mutation CreateRecipe($object: recipes_insert_input!) {
//     insert_recipes_one(object: $object) {
//       id
//     }
//   }
// `;

// export const UNLIKE_RECIPE = gql`
//   mutation UnlikeRecipe($recipe_id: uuid!, $user_id: uuid!) {
//     delete_recipe_likes_by_pk(recipe_id: $recipe_id, user_id: $user_id) {
//       recipe_id
//     }
//   }
// `;


// export const UNBOOKMARK_RECIPE = gql`
//   mutation UnbookmarkRecipe($recipe_id: uuid!, $user_id: uuid!) {
//     delete_user_bookmarks_by_pk(recipe_id: $recipe_id, user_id: $user_id) {
//       recipe_id
//     }
//   }
// `;

// export const ADD_COMMENT = gql`
//   mutation AddComment($recipe_id: uuid!, $content: String!) {
//     insert_comments_one(object: { recipe_id: $recipe_id, content: $content }) {
//       id
//       created_at
//       content
//       user {
//         ...UserProfile
//       }
//     }
//   }
//   ${USER_PROFILE_FRAGMENT}
// `;



// // export const INITIATE_SUBSCRIPTION = gql`
// //   mutation InitiateSubscription {
// //     initiateSubscription {
// //       checkoutUrl
// //     }
// //   }
// // `;
// export const INITIATE_PAYMENT = gql`
//   mutation InitiatePayment($recipeId: uuid!) {
//     initiatePayment(recipeId: $recipeId) {
//       checkoutUrl
//     }
//   }
// `;
// export const DELETE_RECIPE = gql`
//   mutation DeleteRecipe($id: uuid!) {
//     delete_recipes_by_pk(id: $id) {
//       id
//     }
//   }
// `;


// // export const GET_RECIPE_DETAILS = gql`
// //   query GetRecipeDetails($id: uuid!, $user_id: uuid) {
// //     recipes_by_pk(id: $id) {
// //       ...RecipeDetail
// //       # Check current user's interaction status
// //       recipe_likes_aggregate(where: { user_id: { _eq: $user_id } }) { aggregate { count } }
// //       user_bookmarks_aggregate(where: { user_id: { _eq: $user_id } }) { aggregate { count } }
// //       recipe_ratings(where: {user_id: {_eq: $user_id}}) { rating } # Get current user's specific rating
      
// //       # Get total counts from all users
// //       recipe_ratings_aggregate { aggregate { count } }
// //     }
// //   }
// //   ${RECIPE_DETAIL_FRAGMENT}
// // `;


// export const GET_RECIPE_DETAILS = gql`
//   query GetRecipeDetails($id: uuid!, $user_id: uuid) {
//     recipes_by_pk(id: $id) {
//       ...RecipeDetail
//       # Check current user's interaction status
//       recipe_likes_aggregate(where: { user_id: { _eq: $user_id } }) { aggregate { count } }
//       user_bookmarks_aggregate(where: { user_id: { _eq: $user_id } }) { aggregate { count } }
//       recipe_ratings(where: {user_id: {_eq: $user_id}}) { rating } # Get current user's specific rating
      
//       # Get total counts from all users
//       recipe_ratings_aggregate { aggregate { count } }

//       # THIS IS THE CRUCIAL PART FOR PURCHASED ACCESS - ADD THIS
//       user_purchased_recipes_aggregate(where: { user_id: { _eq: $user_id } }) {
//         aggregate {
//           count
//         }
//       }
//     }
//   }
//   ${RECIPE_DETAIL_FRAGMENT}
// `;
// export const LIKE_RECIPE = gql`
//   mutation LikeRecipe($recipe_id: uuid!) {
//     insert_recipe_likes_one(object: { recipe_id: $recipe_id }) {
//       recipe_id
//     }
//   }
// `;
// export const BOOKMARK_RECIPE = gql`
//   mutation BookmarkRecipe($recipe_id: uuid!) {
//     insert_user_bookmarks_one(object: { recipe_id: $recipe_id }) {
//       recipe_id
//     }
//   }
// `;
// export const RATE_RECIPE = gql`
//   mutation RateRecipe($recipe_id: uuid!, $rating: Int!) {
//     insert_recipe_ratings_one(
//       object: { recipe_id: $recipe_id, rating: $rating },
//       on_conflict: { constraint: recipe_ratings_pkey, update_columns: [rating] }
//     ) {
//       rating
//     }
//   }
// `;

// export const UPDATE_RECIPE = gql`
//   mutation UpdateRecipe(
//     $id: uuid!, 
//     $recipeData: recipes_set_input!,
//     $categories: [recipe_categories_insert_input!]!,
//     $ingredients: [recipe_ingredients_insert_input!]!,
//     $instructions: [instructions_insert_input!]!,
//     $images: [recipe_images_insert_input!]!
//   ) {
//     # 1. Atomically delete all old linked data to ensure a clean update.
//     delete_recipe_categories(where: {recipe_id: {_eq: $id}}) { affected_rows }
//     delete_recipe_ingredients(where: {recipe_id: {_eq: $id}}) { affected_rows }
//     delete_instructions(where: {recipe_id: {_eq: $id}}) { affected_rows }
//     delete_recipe_images(where: {recipe_id: {_eq: $id}}) { affected_rows }

//     # 2. Update the main recipe's data (title, description, featured_image_url, etc.)
//     update_recipes_by_pk(pk_columns: {id: $id}, _set: $recipeData) {
//       id
//     }

//     # 3. Insert all the new, updated linked data.
//     insert_recipe_categories(objects: $categories) { affected_rows }
//     insert_recipe_ingredients(objects: $ingredients) { affected_rows }
//     insert_instructions(objects: $instructions) { affected_rows }
//     insert_recipe_images(objects: $images) { affected_rows }
//   }
// `;

// export const GET_USER_PURCHASE_HISTORY = gql`
//   query GetUserPurchaseHistory($userId: uuid!) {
//     user_purchased_recipes(where: {user_id: {_eq: $userId}}, order_by: {purchased_at: desc}) {
//       id
//       purchased_at
//       amount_paid 
//       currency    
//       recipe {
//         id
//         title
//         user { 
//           username
//         }
//       }
//     }
//   }
// `;
