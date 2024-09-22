import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
    authentication: {
        password: {
            type: String,
            required: true,
            select: false,
        },
        salt: {
            type: String,
            select: false,
        },
        sessionToken: { type: String, select: false },
    },
});

export const UserModel = model('User', UserSchema);
export const getUsers = async (options?: {
    skip?: number;
    limit?: number;
    countOnly?: boolean;
}) => {
    try {
        if (options?.countOnly) {
            return UserModel.countDocuments();
        }
        return UserModel.find()
            .skip(options?.skip ?? 0)
            .limit(options?.limit ?? 10);
    } catch (error) {
        console.error('Error fetching users: ', error);
        throw error;
    }
};
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByUsername = (username: string) =>
    UserModel.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) =>
    UserModel.findOne({
        'authentication.sessionToken': sessionToken,
    });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = async (values: Record<string, any>) => {
    new UserModel(values)
        .save()
        .then((user) => user.toObject())
        .catch((error) => {
            throw error;
        });
};
export const deleteUserById = (id: string) => {
    UserModel.findOneAndDelete({ _id: id });
};
export const updateUserById = (id: string, values: Record<string, any>) => {
    UserModel.findByIdAndUpdate(id, values);
};
