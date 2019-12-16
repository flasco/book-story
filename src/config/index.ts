const isDev = process.env.PROJECT_ENV === 'development';

export const defaultApp = isDev ? 'http://localhost:3001' : 'https://tassel-1.avosapps.us';
