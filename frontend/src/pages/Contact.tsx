import React from "react";

const Contact: React.FC = () => {
    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-xl font-semibold mb-2">Contact</h1>
          <p className="text-sm text-gray-600 mb-4">Contact the dev team or open an issue in the repo</p>
          <address className="not-italic text-sm">
            <strong>Support: </strong>
            juma.altaitoon@gmail.com
          </address>
        </div>
    )
}

export default Contact;