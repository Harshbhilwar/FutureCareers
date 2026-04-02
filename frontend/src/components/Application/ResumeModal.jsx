/* eslint-disable react/prop-types */

import React from "react";

const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="resume-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>

        {
          imageUrl.endsWith(".pdf") ? (
            <iframe
              src={imageUrl}
              title="PDF Resume"
              width="100%"
              height="500px"
              style={{ border: "none" }}
            ></iframe>
          ) : (
            <img src={imageUrl} alt="resume" style={{ width: "100%" }} />
          )
        }

      </div>
    </div>
  );
};

export default ResumeModal;
