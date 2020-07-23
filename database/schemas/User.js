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
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            maxlength: 250,
            trim: true,
            lowercase: true,
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
                throw new Error("Username not available.");
            } else if (user.email === email) {
                throw new Error("Email already taken.");
            }
        } else {
            const newUser = await this.create(data);

            return newUser;
        }
    } catch ({ message }) {
        throw new Error(message);
    }
};

UserSchema.statics.authenticate = async function (login, password) {
    try {
        const user = await this.findOne({
            $or: [{ username: login }, { email: login }],
        }).exec();

        if (user !== null) {
            const match = await compare(password, user.password);

            if (match) {
                return { user };
            } else {
                const error = new Error("Incorrect username or password.");

                return { error };
            }
        } else {
            const error = new Error(
                "No user found with this username and password."
            );

            return { error };
        }
    } catch ({ message }) {
        throw new Error(message);
    }
};

module.exports = mongoose.model("User", UserSchema);
