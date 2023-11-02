import React, { useEffect, useRef, useState } from "react";
import CheckCircle from "../icons/check_circle";
import ErrorCircle from "../icons/error_circle";
import InfoCircle from "../icons/info_circle";
import Toast from "../toast";

const EMAIL_REGEX = new RegExp(
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const PASSWORD_REGEX = new RegExp(
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/
);

export default function SignIn() {
  const [toast, setToast] = useState({
    type: "",
    message: "",
    show: false,
  });
  const [data, setdata] = useState({
    email: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
    confirmPassword: {
      value: "",
      error: "",
    },
  });
  const firstTimeRef = useRef(true);

  const checkValue = (type) => (value) => {
    if (type === "email") {
      if (!EMAIL_REGEX.test(value)) {
        return false;
      }
      return true;
    } else if (type === "password") {
      if (!PASSWORD_REGEX.test(value)) {
        return false;
      }
      return true;
    } else {
      if (data.password.value !== value) {
        return false;
      }
      return true;
    }
  };

  const onChangeHandler = (type) => (e) => {
    const isValid = checkValue(type)(e.target.value);
    setdata({
      ...data,
      [type]: {
        error: firstTimeRef.current ? "" : !isValid,
        value: e.target.value,
      },
    });
  };

  const signup = async () => {
    if (data.email.value.length === 0) {
      setToast({
        type: "error",
        message: "Email field is empty",
        show: true,
      });
      setdata({ ...data, email: { ...data.email, error: true } });
    } else if (data.password.value.length === 0) {
      setToast({
        type: "error",
        message: "Password field is empty",
        show: true,
      });
      setdata({ ...data, password: { ...data.password, error: true } });
    } else if (data.confirmPassword.value.length === 0) {
      setToast({
        type: "error",
        message: "Confirm pasword field is empty",
        show: true,
      });
      setdata({
        ...data,
        confirmPassword: { ...data.confirmPassword, error: true },
      });
    } else if (!EMAIL_REGEX.test(data.email.value)) {
      setToast({
        type: "error",
        message: "Email is not valid",
        show: true,
      });
      setdata({ ...data, email: { ...data.email, error: true } });
    } else if (!PASSWORD_REGEX.test(data.password.value)) {
      setToast({
        type: "error",
        message: "Password is not valid",
        show: true,
      });
      setdata({ ...data, password: { ...data.password, error: true } });
    } else if (data.confirmPassword.value !== data.password.value) {
      setToast({
        type: "error",
        message: "confirm password is not matching",
        show: true,
      });
      setdata({
        ...data,
        confirmPassword: { ...data.confirmPassword, error: true },
      });
    } else {
      try {
        const resp = await fetch("http://localhost:3000/api/savepassword", {
          method: "post",
          body: JSON.stringify({
            email: data.email.value,
            password: data.password.value,
          }),
        });
        const respJson = await resp.json();
        if (respJson?.status) {
          setToast({
            type: "success",
            message: "User registered successfully",
            show: true,
          });
          setdata({
            email: {
              value: "",
              error: "",
            },
            password: {
              value: "",
              error: "",
            },
            confirmPassword: {
              value: "",
              error: "",
            },
          });
          firstTimeRef.current = true;
        } else {
          setToast({
            type: "error",
            message:
              respJson?.message || "Database Error, please try again later",
            show: true,
          });
        }
      } catch (e) {
        setToast({
          type: "error",
          message: "Something went wrong!! please try again",
          show: true,
        });
        console.log("DEBUG2", e);
      }
    }
    if (firstTimeRef.current) firstTimeRef.current = false;
  };

  const toggleToast = (value) => {
    setToast({
      ...toast,
      show: value,
    });
  };

  return (
    <div className="h-screen w-screen bg-slate-300 flex justify-center items-center ">
      <div className="relative shadow-sm max-w-[400px] mx-2 w-full min-h-[400px] h-[50%] bg-white flex flex-col items-center justify-between px-8 py-4 rounded-md">
        <div className="font-bold text-xl">Sign up</div>
        <div className="w-full">
          <label htmlFor="email" className="font-semibold w-fit">
            Email
          </label>
          <div
            className={`mt-4 border border-solid ${
              data.email.error === ""
                ? "border-gray-500"
                : data.email.error
                ? "border-red-600"
                : "border-green-800"
            } rounded-lg overflow-hidden p-2 w-full flex`}
          >
            <input
              value={data.email.value}
              onChange={onChangeHandler("email")}
              className="w-full focus-within:outline-none"
              id="email"
            />
            <span>
              {data.email.error === "" ? (
                ""
              ) : data.email.error ? (
                <ErrorCircle />
              ) : (
                <CheckCircle />
              )}
            </span>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="password"
            className="font-semibold flex relative w-fit"
          >
            Password
            <span className="ml-1 cursor-pointer group">
              <InfoCircle />
              <div className="hidden group-hover:block group-focus:block w-[200px] h-[100px] p-2 rounded-md text-xs border border-solid border-gray-500 bg-gray-400 position -top-[100px] left-full absolute">
                Password should contain atleat one capital letter, one small
                letter, one number and one special character. Length should be
                atleast 8.
              </div>
            </span>
          </label>
          <div
            className={`mt-4 border border-solid ${
              data.password.error === ""
                ? "border-gray-500"
                : data.password.error
                ? "border-red-600"
                : "border-green-800"
            } rounded-lg overflow-hidden p-2 w-full flex`}
          >
            <input
              type="password"
              value={data.password.value}
              onChange={onChangeHandler("password")}
              className="w-full focus-within:outline-none"
              id="password"
            />
            <span>
              {data.password.error === "" ? (
                ""
              ) : data.password.error ? (
                <ErrorCircle />
              ) : (
                <CheckCircle />
              )}
            </span>
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="confirmPassword" className="font-semibold w-fit">
            Confirm password{" "}
          </label>
          <div
            className={`mt-4 border border-solid ${
              data.confirmPassword.error === ""
                ? "border-gray-500"
                : data.confirmPassword.error
                ? "border-red-600"
                : "border-green-800"
            } rounded-lg overflow-hidden p-2 w-full flex`}
          >
            <input
              type="password"
              value={data.confirmPassword.value}
              onChange={onChangeHandler("confirmPassword")}
              className="w-full focus-within:outline-none"
              id="confirmPassword"
            />
            <span>
              {data.confirmPassword.error === "" ? (
                ""
              ) : data.confirmPassword.error ? (
                <ErrorCircle />
              ) : (
                <CheckCircle />
              )}
            </span>
          </div>
        </div>
        <button
          onClick={signup}
          className="py-2 px-4 bg-black hover:bg-gray-600 text-white rounded-lg"
        >
          SIGN UP
        </button>

        <Toast {...toast} toggleToast={toggleToast} />
      </div>
    </div>
  );
}
