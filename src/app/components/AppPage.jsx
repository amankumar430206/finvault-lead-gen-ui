import React from "react";

const AppPage = ({ title, description = "", children }) => {
  return (
    <div className="space-y-4">
      <div>
        {title && <h1 className="text-white text-2xl font-semibold tracking-tight">{title}</h1>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
};

export default AppPage;
