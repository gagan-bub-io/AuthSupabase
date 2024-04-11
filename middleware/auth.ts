export default defineNuxtRouteMiddleware((to, from) => {
    console.log(to.path)
    console.log(from.path)
    const user = useSupabaseUser()
    console.log('user.value is',user.value)
    if (to.path === '/login' || to.path === '/signup') {
        if (user.value) {
          return navigateTo('/');
        }
        return;
      }
      if (!user.value) {
        console.log("login first");
        return navigateTo('/login');
      }
      return;
  })