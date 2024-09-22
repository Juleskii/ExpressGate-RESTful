import express from 'express';
import { createUser, getUserByEmail, getUserByUsername } from '../db/users';
import { authentication, random } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username)
            return res
                .status(400)
                .send('Missing required fields: email, password, or username');

        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'The username already exists.' });
        }
        const existingEmail = await getUserByEmail(email);
        if (existingEmail)
            return res
                .status(400)
                .json({ message: 'The user email already exists.' });

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        // return res.status(200).json(user).end();
        const successfulMessage = 'User created successfully';
        return res.sendStatus(201).json({ user, successfulMessage }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Enter a valid email or password.');
        }

        const user = await getUserByEmail(email).select(
            '+authentication.salt +authentication.password'
        );
        if (!user) return res.status(400).send('User not found.');

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash)
            return res
                .status(403)
                .send('The password is incorrect. Please try again.');

        const salt = random();
        user.authentication.sessionToken = authentication(
            salt,
            user._id.toString()
        );

        await user.save();

        // Set cookie
        res.cookie('KENNETH-AUTH', user.authentication.sessionToken, {
            domain: 'localhost',
            path: '/',
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
