import React from "react";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { loginUser } from "slice/auth";
import showToast from "config/toast";
import AuthForm from "components/AuthForm";
import Input from "components/form/Input";

const Login = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const handleLoginUser = async (data) => {
        try {
            const resultAction = await dispatch(loginUser(data));
            const { message } = unwrapResult(resultAction);

            showToast("success", message);
        } catch ({ message }) {
            showToast("error", message);
        }
    };

    return (
        <AuthForm
            heading="Log In"
            altRoute={{
                to: "/signup",
                prompt: "Don't have an account?",
                linkText: "Sign Up",
            }}
            onSubmit={handleSubmit(handleLoginUser)}
        >
            <Input
                placeholder="Username or email address"
                name="login"
                ref={register}
            />
            <Input
                placeholder="Password"
                name="password"
                type="password"
                ref={register}
            />
        </AuthForm>
    );
};

export default Login;
