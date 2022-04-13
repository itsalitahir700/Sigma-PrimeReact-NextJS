import { useState } from "react";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { loginAction } from "../redux/actions/authAction";
import { useRouter } from "next/router";
import * as cookie from "cookie";
import Form, { FormInputWrapper } from "../src/component/Form";

import { HiUser } from "react-icons/hi";
import { MdOutlinePhoneIphone } from "react-icons/md";

const Login = () => {
    const [phone, setPhone] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState(null);
    const [formDataError, setFormDataError] = useState({
        phoneNumber: "",
        password: "",
    });
    const router = useRouter();

    const dispatch = useDispatch();

    const validate = () => {
        let temp = {};
        temp.phoneNumber = phone ? "" : "This field is Required";
        temp.password = password ? "" : "This field is Required";
        setFormDataError({ ...temp });
        return Object.values(temp).every((x) => x === "");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setloading(true);
        setloadingIcon("pi pi-spin pi-spinner");
        if (validate()) {
            const data = {
                username: phone,
                password: password,
                deviceId: "03375909244",
            };
            const res = await dispatch(loginAction(data));
            if (res) router.push("/BulkPayment");
        }

        setloading(false);
        setloadingIcon(null);
    };

    return (
        <div className="login_body">
            <div className="container" id="container">
                <div className="form-container sign-in-container">
                    <Form Heading="Login" info="Let's join us and build your business.">
                        <FormInputWrapper label="Full Name As per CNIC" Icon={HiUser}>
                            <input type="text" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter full name" className="form-input" />
                        </FormInputWrapper>
                        <small className="form-error-msg">{formDataError?.phoneNumber}</small>

                        <FormInputWrapper label="Mobile Number" Icon={MdOutlinePhoneIphone}>
                            <input type="password" name="password" placeholder="Enter Password" className="form-input" value={password} onChange={(e) => setpassword(e.target.value)} />
                        </FormInputWrapper>
                        <div>
                            <small className="form-error-msg">{formDataError?.password}</small>
                        </div>
                        <Button className="form-button" label="Login" icon={loadingIcon || ""} iconPos="right" disabled={loading} onClick={handleLogin}></Button>
                        <div className="forms-control">
                            <h2 className="form-links">
                                No Account?
                                <a className="form-link" href="/sign-up">
                                    Sign up
                                </a>
                            </h2>
                        </div>
                    </Form>
                </div>
                <div className="container-hidden">
                    <div className="overlay-container ">
                        <div className="overlay">
                            <div className="overlay-panel overlay-right">
                                <h1 className="login_h1">Welcome!</h1>
                                <p className="login_p">Please login to access the Portal</p>
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
