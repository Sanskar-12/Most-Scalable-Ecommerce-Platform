import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponseType } from "../types/api-types";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducer/userSlice";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const dispatch = useDispatch();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        _id: user.uid,
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender: gender,
        dob: date,
        role: "user",
      });

      if ("data" in res) {
        toast.success(res.data?.message as string);
        if (res.data) {
          dispatch(userExist(res.data.user));
        }
        console.log(res.data);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponseType).message;
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Fail to Sign in.");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Already Signed In Once?</p>
          <button onClick={loginHandler}>
            <FcGoogle height={"3px"} width={"3px"} />{" "}
            <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
