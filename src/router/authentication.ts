import express from 'express';
import { login, register } from '../controllers/authentication';
import { validateUserCreation } from '../validators/userValidator';

export default (router: express.Router) => {
    router.post('/auth/register', validateUserCreation, register);
    router.post('/auth/login', login);
};
