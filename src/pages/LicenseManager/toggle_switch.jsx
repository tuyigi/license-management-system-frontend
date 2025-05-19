import React from "react";

const ToggleSwitch = ({ checked, onChange }) => {
    const wrapperStyle = {
        display: "flex",
        alignItems: "center",
        width: "100px",
        height: "24px",
        borderRadius: "12px",
        backgroundColor: "#f9f1db",
        cursor: "pointer",
        padding: "2px",
        fontSize: "10px",
        fontWeight: 600,
        userSelect: "none",
    };

    const leftStyle = {
        flex: 1,
        textAlign: "center",
        padding: "2px 6px",
        borderRadius: "10px",
        color: checked ? "#fff" : "#a47d2f",
        backgroundColor: checked ? "#a47d2f" : "transparent",
    };

    const rightStyle = {
        flex: 1,
        textAlign: "center",
        padding: "2px 6px",
        borderRadius: "10px",
        color: !checked ? "#fff" : "#a47d2f",
        backgroundColor: !checked ? "#a47d2f" : "transparent",
    };

    return (
        <div style={wrapperStyle} onClick={onChange}>
            <div style={leftStyle}>Enable</div>
            <div style={rightStyle}>Disable</div>
        </div>
    );
};

export default ToggleSwitch;
