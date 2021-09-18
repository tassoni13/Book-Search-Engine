const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async ({parent, args, context}) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!')
        },
    Mutation: {
        addUser: async ({ parent }, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async ({ parent }, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Can't find user!");
            }

            const correctPW = await User.isCorrectPassword(password);

            if (!correctPW) {
                throw new AuthenticationError('Incorrect username or password');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $addToSet: { savedBooks: args } },
                  { new: true, runValidators: true }
                  );
                }
              throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookID}}},
                { new: true }
                );
                throw new AuthenticationError('You need to be logged in!');
            }
        }
    }
}
};

module.exports = resolvers;