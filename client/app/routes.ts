import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

// export default [
//     index("routes/home.tsx"), 
//     route("inventory", "routes/inventory.tsx"), 
//     route("recipes", "routes/recipes.tsx"),
//     route("recipes/:id", "routes/recipe-details.tsx")
// ] satisfies RouteConfig;

export default [
    layout("routes/layout.tsx", [
        index("routes/inventory.tsx"),
        ...prefix("recipes", [
            index("routes/recipes.tsx"),
            route(":id", "routes/recipe-details.tsx"),
        ]),
    ]),
] satisfies RouteConfig;
