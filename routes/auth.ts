import validate from "../middleWare/validate";
import express from 'express';

import AuthController from "../controllers/AuthController";
import {activateSchema, LoginSchema, RegistrationSchema} from "../helpers/schemas";
import AuthMiddleware from "../middleWare/AuthMiddleware";

const router = express.Router();

router.post('/registration', validate(RegistrationSchema), AuthController.registration);
router.post('/login', validate(LoginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/activate/:link', validate(activateSchema), AuthController.activate);
router.get('/refresh', AuthController.refresh);
router.get('/users', AuthMiddleware, AuthController.getUsers);

export default router;