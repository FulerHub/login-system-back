import validate from "../middleWare/validate";
import express from 'express';

import AuthController from "../controllers/AuthController";
import {activateSchema, LoginSchema, RegistrationSchema} from "../helpers/schemas";

const router = express.Router();

router.post('/registration', validate(RegistrationSchema), AuthController.registration);
router.post('/login', validate(LoginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/activate/:link', validate(activateSchema), AuthController.activate);
router.post('/refresh', AuthController.refresh);
router.get('/users', AuthController.getUsers);

export default router;