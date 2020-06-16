const mongoose = require("mongoose");
const { compare, hash } = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            maxlength: 40,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            maxlength: 250,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            trim: true,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function () {
    // Check if the document is new, then hash the password
    if (this.isNew) {
        try {
            const hashedPassword = await hash(this.password, 10);

            this.password = hashedPassword;
        } catch ({ message }) {
            throw new Error(message);
        }
    }
});

UserSchema.statics.createUser = async function (data) {
    try {
        const { username, email } = data;

        const user = await this.findOne({
            $or: [{ email }, { username }],
        }).exec();

        if (user) {
            if (user.username === username) {
                throw new Error(
                    "That username already exists. Please use a different username"
                );
            } else if (user.email === email) {
                throw new Error(
                    "That email already exists. Please use a different email"
                );
            }
        } else {
            const newUser = await this.create(data);

            return newUser;
        }
    } catch ({ message }) {
        throw new Error(message);
    }
};

UserSchema.statics.authenticate = async function (username, password) {
    try {
        const user = await this.findOne({ username }).exec();

        if (user !== null) {
            const match = await compare(password, user.password);

            if (match) {
                return user;
            } else {
                throw new Error("Password is incorrect.");
            }
        } else {
            throw new Error("User with this username does not exist.");
        }
    } catch ({ message }) {
        throw new Error(message);
    }
};

module.exports = mongoose.model("User", UserSchema);
