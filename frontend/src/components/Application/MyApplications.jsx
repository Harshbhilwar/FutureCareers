/* eslint-disable react/prop-types */

import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (user && user.role === "Employer") {
        axios
          .get(`${import.meta.env.VITE_API_URL}/application/employer/getall`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get(`${import.meta.env.VITE_API_URL}/application/jobseeker/getall`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const deleteApplication = (id) => {
    try {
      const token = localStorage.getItem("token");

      axios
        .delete(`${import.meta.env.VITE_API_URL}/application/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <center>
          <h1>My Applications</h1>
          </center>
          {applications.length <= 0 ? (
            <>
              {" "}
              <center>
              <h4>No Applications Found</h4></center>{" "}
            </>
          ) : (
            applications.map((element) => {
              return (
                <JobSeekerCard
                  element={element}
                  key={element._id}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <center>
          <h1>Applications From Job Seekers</h1>
          </center>
          {applications.length <= 0 ? (
            <>
            <center>
              <h4>No Applications Found</h4>
              </center>
            </>
          ) : (
            applications.map((element) => {
              return (
                <EmployerCard
                  element={element}
                  key={element._id}
                  openModal={openModal}
                />
              );
            })
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          {element.resume.url.endsWith(".pdf") ? (
            <a
              href={element.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", cursor: "pointer" }}
            >
              View Resume (PDF)
            </a>
          ) : (
            <img
              src={element.resume.url}
              alt="resume"
              onClick={() => openModal(element.resume.url)}
              style={{ width: "200px", cursor: "pointer" }}
            />
          )}
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          {element.resume.url.endsWith(".pdf") ? (
            <a
              href={element.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", cursor: "pointer" }}
            >
              View Resume (PDF)
            </a>
          ) : (
            <img
              src={element.resume.url}
              alt="resume"
              onClick={() => openModal(element.resume.url)}
              style={{ width: "200px", cursor: "pointer" }}
            />
          )}
        </div>
      </div>
    </>
  );
};
