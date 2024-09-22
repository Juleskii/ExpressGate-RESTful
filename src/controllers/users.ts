import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = (await getUsers({ countOnly: true })) as number;
        const users = await getUsers({ skip, limit });

        // Generate pagination numbers
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            pageSize: limit,
            totalCount: totalUsers,
        };

        return res.status(200).json({ users, pagination });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        if (!username) return res.sendStatus(400);

        const user = await getUserById(id);
        user.username = username;
        await user.save();

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
