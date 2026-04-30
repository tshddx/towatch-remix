import { form, get, route } from 'remix/fetch-router/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  auth: route('auth', {
    index: get('/'),
    signup: form('signup'),
  }),
})
