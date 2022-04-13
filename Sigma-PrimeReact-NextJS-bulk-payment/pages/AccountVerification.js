import { useState } from "react";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { ResendOTPAction } from "../redux/actions/authAction";
import { useRouter } from "next/router";
import * as cookie from "cookie";
import Cookies from "js-cookie";
import OtpInput from "react-otp-input";

const AccountVerification = () => {
    // const [username, setUsername] = useState("");
    // const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState(null);
    const [formDataError, setFormDataError] = useState({
        username: "",
        phoneNumber: "",
    });
    const router = useRouter();

    const dispatch = useDispatch();

    // const validate = () => {
    //     let temp = {};
    //     temp.username = username ? "" : "This field is Required";
    //     temp.phoneNumber = phoneNumber ? "" : "This field is Required";
    //     setFormDataError({ ...temp });
    //     return Object.values(temp).every((x) => x === "");
    // };

    const handleLogin = async (e) => {
        e.preventDefault();
        setloading(true);
        setloadingIcon("pi pi-spin pi-spinner");
        // if (validate()) {
        //     const data = {
        //         fullName: username,
        //         cellPhone: phoneNumber,
        //         deviceId: "03375909244",
        //     };
        //     const res = await dispatch(SignUpAction(data));
        //     if (res) router.push("/BulkPayment");
        // }

        setloading(false);
        setloadingIcon(null);
    };
    const [state, setState] = useState({
        phone: "",
        otp: "",
    });
    const handleChange = (otp) => setState({ otp });
    const handleResendPassword = async () => {
        const phoneNumber = Cookies.get("phoneNumber");
        console.log("phoneNumber", phoneNumber);
        if (phoneNumber) {
            const res = await dispatch(ResendOTPAction(phoneNumber));
        }
    };

    return (
        <div className="login_body">
            <div className="container" id="container">
                <div className="form-container sign-in-container">
                    <div>
                        <div className="forms-control opt-verification-container">
                            <center>
                                <h1>Verfy Mobile Number</h1>
                                <p>Please enter OTP sent on mobile</p>
                            </center>
                            <div className="code-verification-input">
                                <OtpInput value={state.otp} className="form-otp-input" onChange={handleChange} numInputs={4} separator={<span></span>} />
                            </div>
                            <h2 className="form-links">
                                if you didn't receive a code?
                                <p className="form-link" onClick={handleResendPassword}>
                                    RESEND
                                </p>
                            </h2>
                        </div>
                        <Button className="form-button" label="Submit" icon={loadingIcon || ""} iconPos="right" disabled={loading} onClick={handleLogin}></Button>
                    </div>
                </div>
                <div className="container-hidden">
                    <div className="overlay-container ">
                        <div className="overlay">
                            <div className="overlay-panel overlay-right">
                                <h1 className="login_h1">Welcome!</h1>
                                <p className="login_p">Please Sign up to access the Portal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountVerification;

export async function getServerSideProps(context) {
    const { req } = context;
    const { auth } = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    if (auth) {
        return {
            redirect: {
                permanent: false,
                destination: "/BulkPayment",
            },
        };
    }

    return { props: {} };
}
