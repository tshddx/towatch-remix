import { form, get, post, resources, route } from "remix/fetch-router/routes";

export const routes = route({
  assets: get("/assets/*path"),
  home: "/",
  designGuide: get("/design-guide"),
  movies: resources("movies", { only: ["show"], param: "movieId" }),
  people: resources("people", { only: ["show"], param: "personId" }),
  auth: route("auth", {
    login: form("login"),
    signup: form("signup"),
    signout: post("signout"),
  }),
});
