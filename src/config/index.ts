const currentVersion = process.env.PROJECT_ENV;

export const defaultApp =
  currentVersion === 'development' ? 'http://localhost:3000' : '';
