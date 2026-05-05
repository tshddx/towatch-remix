import { form, get, post, route } from "remix/fetch-router/routes";

export const routes = route({
  assets: get("/assets/*path"),
  home: "/",
  designGuide: get("/design-guide"),
  auth: route("auth", {
    login: form("login"),
    signup: form("signup"),
    signout: post("signout"),
  }),
});
