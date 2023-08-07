export function logErrorInDevMode(e : any) {
  process.env.NODE_ENV === 'development' && console.error(e);
}