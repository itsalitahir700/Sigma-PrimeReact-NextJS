import { useState } from "react";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { CreatePasswordAction } from "../redux/actions/authAction";
import { useRouter } from "next/router";
import * as cookie from "cookie";
import Form, { FormInputWrapper } from "../src/component/Form";
import Cookies from "js-cookie";
import { FaUnlockAlt } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";

import { AiFillEye } from "react-icons/ai";

const Login = () => {
    const accountId = Cookies.get("accountId");
    const router = useRouter();
    const dispatch = useDispatch();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState(null);
    const [formDataError, setFormDataError] = useState({
        confirmPassword: "",
        password: "",
        confirmPasswordMatching: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        let temp = {};
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,18}$/;
        temp.password = password && password.match(regex) ? "" : "password not match with requirment";
        temp.confirmPassword = confirmPassword === password ? "" : "password not match";
        temp.confirmPasswordMatching = confirmPassword ? "" : "This field is Required";
        setFormDataError({ ...temp });
        return Object.values(temp).every((x) => x === "");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setloading(true);
        setloadingIcon("pi pi-spin pi-spinner");
        if (validate()) {
            if (accountId) {
                const data = {
                    accountId: accountId,
                    confirmPassword: confirmPassword,
                    password: password,
                };
                setpassword("");
                setConfirmPassword("");
                const res = await dispatch(CreatePasswordAction(data));
                if (res?.code === 13) router.push("/login");
            }
        }
        setloading(false);
        setloadingIcon(null);
    };

    const passwordType = showPassword ? "text" : "password";
    const passwordIcon = showPassword ? <AiFillEye className="form-input-icon show-password-icon" /> : <BsFillEyeSlashFill className="form-input-icon show-password-icon" />;
    return (
        <div className="login_body">
            <div className="container" id="container">
                <div className="form-container sign-in-container">
                    <Form Heading="Set your password" info="Must be 8 characters with at least 1 digit, 1 uppercase, 1 lowercase and 1 special character.">
                        <FormInputWrapper label="Password" Icon={FaUnlockAlt}>
                            <input type={passwordType} name="password" value={password} onChange={(e) => setpassword(e.target.value)} placeholder="Enter password" className="form-input" />
                            <div onClick={() => setShowPassword(!showPassword)}>{passwordIcon}</div>
                        </FormInputWrapper>
                        <small className="form-error-msg">{formDataError?.password}</small>
                        <FormInputWrapper label="Confirm password" Icon={FaUnlockAlt}>
                            <input type={passwordType} name=" confirm password" placeholder="Confirm password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <div onClick={() => setShowPassword(!showPassword)}>{passwordIcon}</div>
                        </FormInputWrapper>
                        <div>
                            <small className="form-error-msg">{formDataError?.confirmPassword || formDataError?.confirmPasswordMatching}</small>
                        </div>
                        <Button className="form-button" label="Create" icon={loadingIcon || ""} iconPos="right" disabled={loading} onClick={handleLogin}></Button>
                    </Form>
                </div>
                <div className="container-hidden">
                    <div className="overlay-container ">
                        <div className="overlay">
                            <div className="overlay-panel overlay-right">
                                <h1 className="login_h1">Welcome!</h1>
                                <p className="login_p">Please create password to access the Portal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

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
