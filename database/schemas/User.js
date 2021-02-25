const { Schema, model } = require("mongoose");
const { compare, hash } = require("bcrypt");

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
        admin: Boolean,
    },
    { timestamps: true }
);

UserSchema.set("toJSON", { getters: true });

UserSchema.options.toJSON.transform = (_, ret) => {
    const obj = { ...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};

UserSchema.pre("save", async function () {
    // Check if the document is new, then hash the password
    if (this.isNew) {
        try {
            const hashedPassword = await hash(this.password, 10);

            this.password = hashedPassword;
        } catch (e) {
            throw e;
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
                throw new Error("Email not available.");
            }
        } else {
            const newUser = await this.create(data);

            return newUser;
        }
    } catch (e) {
        throw e;
    }
};

UserSchema.statics.authenticate = async function (login, password) {
    try {
        const user = await this.findOne({
            $or: [{ username: login }, { email: login }],
        }).exec();

        if (user !== null) {
            const match = await compare(password, user.password);

            const userObj = { exists: true };

            if (match) {
                return { ...userObj, isLoggedIn: true, data: user };
            } else {
                const error = new Error("Incorrect username or password.");

                return { ...userObj, isLoggedIn: false, error };
            }
        } else {
            const error = new Error("No user found with this username");

            return { isLoggedIn: false, error };
        }
    } catch (e) {
        throw e;
    }
};

module.exports = model("User", UserSchema);
