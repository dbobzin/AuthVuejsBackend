const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Email is not valid",
        },
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN", "MANAGER"],
        default: "USER",
    },
});

// Static signup method
userSchema.statics.register = async function (email, password, firstname, lastname, role = "USER"){
    // Validation
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }

    // Uncomment and customize as needed
    // if (!validator.isStrongPassword(password)) {
    //     throw Error("Password not strong enough");
    // }
    if (!firstname) {
        throw Error("Fill out the firstname");
    }
    if (!lastname) {
        throw Error("Fill out the lastname");
    }
    if (!validator.isLength(password, { min: 6 })) {
        throw Error("Password must be at least 6 characters long");
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, firstname, lastname, password: hash, role });

    return user;
};

// Common login method
userSchema.statics.login = async function (email, password, role = null) {
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error("Incorrect email or user");
    }

    // Check if the user has the specified role (if role is provided)
    if (role && user.role !== role) {
        throw Error("User does not have the required role");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Incorrect password or user");
    }

    return user;
};


module.exports = mongoose.model("User", userSchema);
