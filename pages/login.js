import { useState } from "react";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { loginAction } from "../redux/actions/authAction";
import { useRouter } from "next/router";

const Login = () => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState(null);
    const router = useRouter();

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setloading(true);
        setloadingIcon("pi pi-spin pi-spinner");
        const data = {
            username: username,
            password: password,
            deviceId: "03008431203",
        };
        const res = await dispatch(loginAction(data));
        if (res) router.push("/");
        setloading(false);
        setloadingIcon(null);
    };

    return (
        <div className="login_body">
            <div className="container" id="container">
                <div className="form-container sign-in-container">
                    <form action="#" className="login_form">
                        <div className="p-mb-4">
                            <h1 className="login_h1">Login</h1>
                        </div>
                        <div className="p-mt-4">
                            <input className="login_input" value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="User Name" />
                            <input className="login_input" value={password} onChange={(e) => setpassword(e.target.value)} type="password" placeholder="Password" />
                            <div className="p-mt-4">
                                <Button className="login_button" label="Login" icon={loadingIcon || ""} iconPos="right" disabled={loading} onClick={handleLogin} />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-right">
                            <h1 className="login_h1">Welcome!</h1>
                            <p className="login_p">Please login to access the Portal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
