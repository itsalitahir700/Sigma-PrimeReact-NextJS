import React from "react";

export default function Form({ Heading, info, children }) {
    return (
        <div className="form-body">
            <div className="form-container">
                <div className="form-body">
                    <h1 className="form-heading">{Heading}</h1>
                    {info && <p className="form-info">{info}</p>}
                    <form className="forms">{children}</form>
                </div>
            </div>
        </div>
    );
}

export const FormInputWrapper = ({ label, children, Icon }) => {
    return (
        <div className="forms-control">
            <label className="form-label">{label}</label>
            <div className="form-input-container">
                {Icon && <Icon className="form-input-icon" />}
                {children}
            </div>
        </div>
    );
};
