import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";

import { AppTopbar } from "../src/AppTopbar";
import { AppMenu } from "../src/AppMenu";
import { AppProfile } from "../src/AppProfile";
import { AppConfig } from "../src/AppConfig";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import PrimeReact from "primereact/utils";
import { ToastContainer, Zoom } from "react-toastify";
import * as cookie from "cookie";

import store from "../redux/store";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/layout/flags/flags.css";
import "../src/layout/layout.scss";
import "../src/App.scss";
import "../styles/Login.scss";
import "../styles/Table.scss";
import { getWallet } from "../redux/actions/authAction";

const App = ({ Component, pageProps, auth, accountBalance }) => {
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("dark");
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(false);
    const sidebar = useRef();
    let menuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
        menuClick = false;
    };

    const onToggleMenu = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                setOverlayMenuActive((prevState) => !prevState);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }
        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };

    const menu = [
        // { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
        { label: "Bulk Payment", icon: "pi pi-fw pi-table", to: "/BulkPayment" },
        // {
        //     label: "UI Kit",
        //     icon: "pi pi-fw pi-sitemap",
        //     items: [
        //         { label: "Form Layout", icon: "pi pi-fw pi-id-card", to: "/FormLayoutDemo" },
        //         { label: "Input", icon: "pi pi-fw pi-check-square", to: "/InputDemo" },
        //         { label: "Float Label", icon: "pi pi-fw pi-bookmark", to: "/FloatLabelDemo" },
        //         { label: "Button", icon: "pi pi-fw pi-mobile", to: "/ButtonDemo" },
        //         { label: "Table", icon: "pi pi-fw pi-table", to: "/TableDemo" },
        //         { label: "List", icon: "pi pi-fw pi-list", to: "/ListDemo" },
        //         { label: "Tree", icon: "pi pi-fw pi-share-alt", to: "/TreeDemo" },
        //         { label: "Panel", icon: "pi pi-fw pi-tablet", to: "/PanelDemo" },
        //         { label: "Overlay", icon: "pi pi-fw pi-clone", to: "/OverlayDemo" },
        //         { label: "Menu", icon: "pi pi-fw pi-bars", to: "/MenuDemo" },
        //         { label: "Message", icon: "pi pi-fw pi-comment", to: "/MessagesDemo" },
        //         { label: "File", icon: "pi pi-fw pi-file", to: "/FileDemo" },
        //         { label: "Chart", icon: "pi pi-fw pi-chart-bar", to: "/ChartDemo" },
        //         { label: "Misc", icon: "pi pi-fw pi-circle-off", to: "/MiscDemo" },
        //     ],
        // },
        // {
        //     label: "Utilities",
        //     icon: "pi pi-fw pi-globe",
        //     items: [
        //         { label: "Display", icon: "pi pi-fw pi-desktop", to: "/DisplayDemo" },
        //         { label: "Elevation", icon: "pi pi-fw pi-external-link", to: "/ElevationDemo" },
        //         { label: "Flexbox", icon: "pi pi-fw pi-directions", to: "/FlexBoxDemo" },
        //         { label: "Icons", icon: "pi pi-fw pi-search", to: "/IconsDemo" },
        //         { label: "Grid System", icon: "pi pi-fw pi-th-large", to: "/GridDemo" },
        //         { label: "Spacing", icon: "pi pi-fw pi-arrow-right", to: "/SpacingDemo" },
        //         { label: "Typography", icon: "pi pi-fw pi-align-center", to: "/TypographyDemo" },
        //         { label: "Text", icon: "pi pi-fw pi-pencil", to: "/TextDemo" },
        //     ],
        // },
        // {
        //     label: "Pages",
        //     icon: "pi pi-fw pi-clone",
        //     items: [
        //         { label: "Crud", icon: "pi pi-fw pi-user-edit", to: "/Crud" },
        //         { label: "Calendar", icon: "pi pi-fw pi-calendar-plus", to: "/Calendar" },
        //         { label: "Empty Page", icon: "pi pi-fw pi-circle-off", to: "/EmptyPage" },
        //     ],
        // },
        // {
        //     label: "Menu Hierarchy",
        //     icon: "pi pi-fw pi-search",
        //     items: [
        //         {
        //             label: "Submenu 1",
        //             icon: "pi pi-fw pi-bookmark",
        //             items: [
        //                 {
        //                     label: "Submenu 1.1",
        //                     icon: "pi pi-fw pi-bookmark",
        //                     items: [
        //                         { label: "Submenu 1.1.1", icon: "pi pi-fw pi-bookmark" },
        //                         { label: "Submenu 1.1.2", icon: "pi pi-fw pi-bookmark" },
        //                         { label: "Submenu 1.1.3", icon: "pi pi-fw pi-bookmark" },
        //                     ],
        //                 },
        //                 {
        //                     label: "Submenu 1.2",
        //                     icon: "pi pi-fw pi-bookmark",
        //                     items: [
        //                         { label: "Submenu 1.2.1", icon: "pi pi-fw pi-bookmark" },
        //                         { label: "Submenu 1.2.2", icon: "pi pi-fw pi-bookmark" },
        //                     ],
        //                 },
        //             ],
        //         },
        //         {
        //             label: "Submenu 2",
        //             icon: "pi pi-fw pi-bookmark",
        //             items: [
        //                 {
        //                     label: "Submenu 2.1",
        //                     icon: "pi pi-fw pi-bookmark",
        //                     items: [
        //                         { label: "Submenu 2.1.1", icon: "pi pi-fw pi-bookmark" },
        //                         { label: "Submenu 2.1.2", icon: "pi pi-fw pi-bookmark" },
        //                         { label: "Submenu 2.1.3", icon: "pi pi-fw pi-bookmark" },
        //                     ],
        //                 },
        //                 {
        //                     label: "Submenu 2.2",
        //                     icon: "pi pi-fw pi-bookmark",
        //                     items: [
        //                         { label: "Submenu 2.2.1", icon: "pi pi-fw pi-bookmark" },
        //                         { label: "Submenu 2.2.2", icon: "pi pi-fw pi-bookmark" },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        // },
        // // { label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
        // {
        //     label: "View Source",
        //     icon: "pi pi-fw pi-search",
        //     command: () => {
        //         window.location = "https://github.com/schneidersteve/sigma-react-nextjs";
        //     },
        // },
    ];

    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const isDesktop = () => {
        if (typeof window !== "undefined") {
            return window.innerWidth > 1024;
        }
        return true;
    };

    const isSidebarVisible = () => {
        if (isDesktop()) {
            if (layoutMode === "static") return !staticMenuInactive;
            else if (layoutMode === "overlay") return overlayMenuActive;
            else return true;
        }

        return true;
    };

    const logo = layoutColorMode === "dark" ? "assets/layout/images/logo-white.svg" : "assets/layout/images/logo.svg";

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
    });

    const sidebarClassName = classNames("layout-sidebar", {
        "layout-sidebar-dark": layoutColorMode === "dark",
        "layout-sidebar-light": layoutColorMode === "light",
    });
    const component = <Component {...pageProps} />;

    const { pathname } = useRouter();

    return (
        <Provider store={store}>
            <ToastContainer transition={Zoom} autoClose={50000} hideProgressBar={true} position="top-center" draggable pauseOnHover />
            {pathname !== "/Login" ? (
                <div className={wrapperClass} onClick={onWrapperClick}>
                    <AppTopbar onToggleMenu={onToggleMenu} />

                    <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={isSidebarVisible()} unmountOnExit>
                        <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
                            <div className="layout-logo">
                                <img alt="Logo" src={logo} />
                            </div>
                            <AppProfile auth={auth} accountBalance={accountBalance} />
                            <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
                        </div>
                    </CSSTransition>

                    <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange} layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

                    <div className="layout-main">{component}</div>
                </div>
            ) : (
                component
            )}
        </Provider>
    );
};
export default App;

// App.getInitialProps = async ({ ctx }) => {
//     let auth = cookie.parse(ctx.req?.headers?.cookie || "")?.auth || null;
//     auth = JSON.parse(auth);
//     let accountBalance = null;
//     if (auth?.access_token) accountBalance = (await getWallet(`Bearer ${auth.access_token}`)).accountBalance;
//     return { auth, accountBalance };
// };
