import React, { useState, useEffect } from "react";
import SignUp from "../src/component/SignUp";
import OtpVerification from "../src/component/OtpVerfication";
import PassworsVerfication from "../src/component/passwordVerification";

export default function Registration() {
    const [registrationTab, setRegistrationTab] = useState("signup");
    useEffect(() => {
        const registrationtab = localStorage.getItem("registration-tab") || "signup";
        localStorage.setItem("registration-tab", registrationtab);
        setRegistrationTab(registrationtab);
    }, [registrationTab]);

    return (
        <div>
            {registrationTab === "signup" && <SignUp setRegistrationTab={setRegistrationTab} />}
            {registrationTab === "otp" && <OtpVerification setRegistrationTab={setRegistrationTab} />}
            {registrationTab === "passowrd" && <PassworsVerfication setRegistrationTab={setRegistrationTab} />}
        </div>
    );
}
