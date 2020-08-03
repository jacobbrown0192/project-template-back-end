import { Router } from 'express';
import users from './users'

// guaranteed to get dependencies
export default () => {
  const app = Router();
  users(app);

  return app
}
