const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, {user=null, params}) => {
            return User.findOne({$or: [{_id: user ? user._id : params.id }, { username: params.username}]}).populate('savedBooks')
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!')
        },
    Mutation: {
        addUser: async (parent, { body }) => {
            const user = await User.create(body);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { body }) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }]});

            if (!user) {
                throw new AuthenticationError("Can't find user!");
            }

            const correctPW = await User.isCorrectPassword(body.password);

            if (!correctPW) {
                throw new AuthenticationError('Incorrect username or password');
            }

            const token = signToken(user);

            return { token, user }
        }
    }
}
};

module.exports = resolvers;