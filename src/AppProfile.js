import React, { useState } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

export const AppProfile = ({ auth, accountBalance }) => {
    const [expanded, setExpanded] = useState(false);

    const { authenticationSlice, walletSlice } = useSelector((state) => state);

    const onClick = (event) => {
        setExpanded((prevState) => !prevState);
        event.preventDefault();
    };

    const onLogout = () => {
        Cookies.remove("auth");
        localStorage.removeItem("auth");
        window.location.href = "/Login";
    };

    return (
        <div className="layout-profile">
            <div>
                <img src="assets/layout/images/profile.png" alt="Profile" />
            </div>
            <p className="p-link layout-profile-link ">
                <b>Balance : {walletSlice?.accountBalance || accountBalance} Rs</b>
            </p>
            <br />
            <button className="p-link layout-profile-link " onClick={onClick}>
                <span className="username">{auth?.fullName || authenticationSlice?.fullName}</span>
                <i className="pi pi-fw pi-cog" />
            </button>

            <CSSTransition classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={expanded} unmountOnExit>
                <ul className={classNames({ "layout-profile-expanded": expanded })}>
                    <li>
                        <button type="button" className="p-link">
                            <i className="pi pi-fw pi-user" />
                            <span>Account</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" className="p-link">
                            <i className="pi pi-fw pi-inbox" />
                            <span>Notifications</span>
                            <span className="menuitem-badge">2</span>
                        </button>
                    </li>
                    <li onClick={onLogout}>
                        <button type="button" className="p-link">
                            <i className="pi pi-fw pi-power-off" />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </CSSTransition>
        </div>
    );
};
