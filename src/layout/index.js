const LayoutCard = ({ children }) => {
    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card">{children}</div>
            </div>
        </div>
    );
};

export default LayoutCard;
