import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { registerUser } from "slice/auth";
import showToast from "config/toast";
import { validUsernameCheck, validPasswordCheck } from "./validators";
import AuthForm from "components/AuthForm";
import Input from "components/form/Input";

const Signup = () => {
    const { errors, register, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const handleRegisterUser = async (data) => {
        const resultAction = await dispatch(registerUser(data));
        const { message, body } = resultAction.payload;

        if (registerUser.fulfilled.match(resultAction)) {
            showToast("success", message);
        } else {
            showToast("error", message, body);
        }
    };

    return (
        <AuthForm
            heading="Sign Up"
            altRoute={{
                to: "/login",
                prompt: "Already have an account?",
                linkText: "Log In",
            }}
            onSubmit={handleSubmit(handleRegisterUser)}
        >
            <Input
                error={errors.username}
                placeholder="Username"
                name="username"
                ref={register({
                    maxLength: {
                        value: 40,
                        message: "Max username length: 40.",
                    },
                    required: "Username is required.",
                    validate: validUsernameCheck,
                })}
            />

            <Input
                error={errors.email}
                placeholder="Email"
                name="email"
                type="email"
                ref={register({
                    required: "Email is required.",
                })}
            />

            <Input
                error={errors.password}
                placeholder="Password"
                name="password"
                type="password"
                ref={register({
                    minLength: {
                        value: 6,
                        message: "Minimum password length: 6.",
                    },
                    required: "Password is required.",
                    validate: validPasswordCheck,
                })}
            />
        </AuthForm>
    );
};

export default Signup;
