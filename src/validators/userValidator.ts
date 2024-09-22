import { check } from 'express-validator';

export const validateUserCreation = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email address'),

    check('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),

    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Za-z]/)
        .withMessage('Password must contain at least one letter')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[@$!%*#?&]/)
        .withMessage(
            'Password must contain at least one special character (@$!%*#?&)'
        ),
];
