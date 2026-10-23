import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("inventory", "routes/inventory.tsx"), 
    route("recipes", "routes/recipes.tsx"),
    route("recipes/:id", "routes/recipe-details.tsx")
] satisfies RouteConfig;
