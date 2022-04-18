import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { VerifyOTPAction, ResendOTPAction } from "../../redux/actions/authAction";
import { useRouter } from "next/router";
import * as cookie from "cookie";
import Cookies from "js-cookie";
import OtpInput from "react-otp-input";
import ReactSpinnerTimer from "react-spinner-timer";

const AccountVerification = ({ setRegistrationTab }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState(null);
    const [refreshSpinner, setRefreshSpinner] = useState(false);
    const [lapData, setLapData] = useState({});
    const accountID = Cookies.get("accountId");
    const [formDataError, setFormDataError] = useState({
        otp: "",
    });
    const [otp, setOtp] = useState({
        phone: "",
        otp: "",
    });

    const handleOnLapInteraction = (lap) => {
        setLapData(lap);
    };

    const validate = () => {
        let temp = {};
        temp.otp = otp.otp ? "" : "This field is Required";
        setFormDataError({ ...temp });
        return Object.values(temp).every((x) => x === "");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setloading(true);
        setloadingIcon("pi pi-spin pi-spinner");
        if (validate()) {
            if (accountID) {
                const data = {
                    accountId: accountID,
                    pin: otp.otp,
                };
                const res = await dispatch(VerifyOTPAction(data));
                if (res.code === 2) setRegistrationTab("passowrd");
            }
        }
        setloading(false);
        setloadingIcon(null);
    };

    const handleChange = (otp) => setOtp({ otp });
    const handleResendPassword = async () => {
        const phoneNumber = Cookies.get("phoneNumber");
        if (phoneNumber) {
            handleReplay(true);
            await dispatch(ResendOTPAction(phoneNumber));
        }
    };
    const handleReplay = () => {
        setRefreshSpinner(true);
    };

    useEffect(() => {
        if (refreshSpinner) setRefreshSpinner(false);
    }, [refreshSpinner]);

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
                            <center>
                                <ReactSpinnerTimer className="spinner" timeInSeconds={60} totalLaps={1} isPaused={false} isRefresh={refreshSpinner} onLapInteraction={(lap) => handleOnLapInteraction(lap)} />
                            </center>
                            <div className="code-verification-input">
                                <OtpInput value={otp.otp} className="form-otp-input" onChange={handleChange} numInputs={4} separator={<span></span>} />
                                <div className="form-error-msg pt-3">{formDataError.otp}</div>
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
