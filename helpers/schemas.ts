import { object, string} from 'yup';
export const RegistrationSchema = object({
    body: object({
        name: string().required(),
        email: string().email("Invalid email format").required(),
        password: string().min(6, 'Password is should be 6 chars min.').required()
    })
});

export const LoginSchema = object({
    body: object({
        email: string().email("Invalid email format").required(),
        password: string().min(6, 'Password is should be 6 chars min.').required()
    })
});

export const activateSchema = object({
    params: object({
        link: string().required(),
    })
});