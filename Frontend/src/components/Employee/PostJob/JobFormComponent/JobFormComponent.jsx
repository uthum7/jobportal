import axios from "axios";
import "./formstyle.css";
import { useRef, useState } from "react";
import { toast } from 'sonner';

const JobFormComponent = () => {
  const [requirements, setRequirements] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [tags, setTags] = useState([]);
  const title = useRef("");
  const exp = useRef("");
  const deadline = useRef("");
  const jobType = useRef("");
  const mode = useRef("");
  const jobDescription = useRef("");
  const requirement = useRef("");
  const qualification = useRef("");
  const responsibility = useRef("");
  const tag = useRef("");
  const [titledata, setTitle] = useState("");
  const [expdata, setExp] = useState("");
  const [deadlinedata, setDeadline] = useState("");
  const [jobTypedata, setJobType] = useState("");
  const [modedata, setMode] = useState("");
  const [jobDescriptiondata, setJobDescription] = useState("");



  const clearAll = () =>{
      title.current.value = "";
      exp.current.value = "";
      mode.current.value = "";
      jobType.current.value = "";
      deadline.current.value = "";
      jobDescription.current.value = "";
      requirement.current.value = "";
      qualification.current.value = "";
      responsibility.current.value = "";
      tag.current.value = "";
      setJobDescription("");
      setRequirements([]);
      setQualifications([]);
      setResponsibilities([]);
      setTags([]);
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    const job = {
      JobTitle: title.current.value,
      JobYearsExperience: exp.current.value,
      JobMode: mode.current.value,
      JobType: jobType.current.value,
      JobDeadline: deadline.current.value ? new Date(deadline.current.value) : null,
      JobDescription: jobDescription.current.value,
      Requirements: requirements,
      Qualifications: qualifications,
      Responsibilities: responsibilities,
      Tags: tags,
    }

    console.log(job)
    const resp = axios.post("http://localhost:5001/api/job/create", job)


    resp.then((res) => {
      console.log(res.data);
      if (res.status === 200) {
        toast.success("Job posted successfully", {
          className: 'bg-emerald-700 text-white',
        });
      } else {
        toast.error(res.status, {
          className: 'bg-red-700 text-white',
        });
      }
    }).catch((err) => {
      console.log(err);
      toast.error("Error posting job", {
        className: 'bg-red-700 text-white',
      });
    })
    clearAll();
  }
  const handleAddRequirement = (e) => {
    e.preventDefault();
    setRequirements([...requirements, requirement.current.value]);
    toast.success("Requirement added successfully", {
      className: 'bg-emerald-700 text-white',
    });
    console.log(requirements);
    requirement.current.value = "";
  }

  const handleAddQualification = (e) => {
    e.preventDefault();
    setQualifications([...qualifications, qualification.current.value]);
    toast.success("Qualification added successfully", {
      className: 'bg-emerald-700 text-white',
    });
    qualification.current.value = "";
  }

  const handleDeleteRequirement = (index) => {
    toast.success("Requirement deleted successfully");
    setRequirements(requirements.filter((_, i) => i !== index));
    console.log(requirements);
  }

  const handleDeleteQualification = (index) => {
    toast.success("Qualification deleted successfully");
    setQualifications(qualifications.filter((_, i) => i !== index));
    console.log(qualifications);
  }

  const handleAddResponsibility = (e) => {
    e.preventDefault();
    setResponsibilities([...responsibilities, responsibility.current.value]);
    toast.success("Responsibility added successfully");
    responsibility.current.value = "";
  }

  const handleDeleteResponsibility = (index) => {
    toast.success("Responsibility deleted successfully");
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
    console.log(responsibilities);
  }

  const handleAddTag = (e) => {
    e.preventDefault();
    setTags([...tags, tag.current.value]);
    toast.success("Tag added successfully");
    tag.current.value = "";
  }

  const handleDeleteTag = (index) => {
    toast.success("Tag deleted successfully");
    setTags(tags.filter((_, i) => i !== index));
    console.log(tags);
  }

  return (
    <>

      <div className="job-form-component">
        <form onSubmit={handleSubmit}>
          <div className="basic-info form-container">
            <div className="job-form-component-header">
              <h3>Basic Details</h3>
            </div>
            <div className="row">
              <div className="col">
                <div className="label">Job Title</div>
                <input type="text" ref={title} className="input-text" />
              </div>
              <div className="col  col-left">
                <div className="label">Years of Experience</div>
                <input type="text" ref={exp} className="input-text" />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="label">Job Mode</div>
                <select name="job-mode" id="job-mode" ref={mode} className="input-text">
                  <option value="onsite" className="option-text">Onsite</option>
                  <option value="remote" className="option-text">Remote</option>
                  <option value="hybrid" className="option-text">Hybrid</option>
                </select>
              </div>
              <div className="col col-left">
                <div className="label">Deadline</div>
                <input type="Date" ref={deadline} className="input-text" />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="label">Job Type</div>
                <select name="job-type" id="job-type" ref={jobType} className="input-text">
                  <option value="full time" className="option-text">Full Time</option>
                  <option value="part time" className="option-text">Part Time</option>
                  <option value="internship" className="option-text">Internship</option>
                  <option value="project base" className="option-text">Project Base</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-row">
                <div className="label">Job Description</div>
                <textarea name="job-description" id="job-description" ref={jobDescription} className="description" placeholder="Enter Job Description" rows="10"></textarea>
              </div>
            </div>

          </div>
          <div className="requirements form-container">
            <div className="job-form-component-header">
              <h3>Requirements</h3>
            </div>
            <div className="row">
              <div className="col-row">
                <div className="label">Add New Requirement</div>
                <input type="text" ref={requirement} className="input-text add-requirement" />

                <button type="button" className="btn-add-requirement" onClick={handleAddRequirement}>Add</button>
              </div>
            </div>
            <div className="row">
              <div className="col-row">
                <div className="requirement-container">

                  {
                    requirements.map((requirement, index) => (
                      <div className="requirement">
                        <p key={index} className="requirement-text">{requirement}</p>
                        <button type="button" className="btn-delete-requirement" onClick={() => handleDeleteRequirement(index)}>X</button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>


          </div>

          <div className="qualifications form-container">
            <div className="job-form-component-header">
              <h3>Qualifications</h3>
            </div>
            <div className="row">
              <div className="col-row">
                <div className="label">Add New Qualification</div>
                <input type="text" ref={qualification} className="input-text add-qualification" />

                <button type="button" className="btn-add-qualification" onClick={handleAddQualification}>Add</button>
              </div>
            </div>
            <div className="row">
              <div className="col-row">
                <div className="qualification-container">
                  {
                    qualifications.map((qualification, index) => (
                      <div className="qualification">
                        <p key={index} className="qualification-text">{qualification}</p>
                        <button type="button" className="btn-delete-qualification" onClick={() => handleDeleteQualification(index)}>X</button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>


          <div className="responsibilities form-container">
            <div className="job-form-component-header">
              <h3>Responsibilities</h3>
            </div>
            <div className="row">
              <div className="col-row">
                <div className="label">Add New Responsibility</div>
                <input type="text" ref={responsibility} className="input-text add-responsibility" />

                <button type="button" className="btn-add-responsibility" onClick={handleAddResponsibility}>Add</button>
              </div>
            </div>
            <div className="row">
              <div className="col-row">
                <div className="responsibility-container">
                  {
                    responsibilities.map((responsibility, index) => (
                      <div className="responsibility">
                        <p key={index} className="responsibility-text">{responsibility}</p>
                        <button type="button" className="btn-delete-responsibility" onClick={() => handleDeleteResponsibility(index)}>X</button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="tags form-container">
            <div className="job-form-component-header">
              <h3>Tags</h3>
            </div>
            <div className="row">
              <div className="col-row">
                <div className="label">Add New Tag</div>
                <input type="text" ref={tag} className="input-text add-tag" />

                <button type="button" className="btn-add-tag" onClick={handleAddTag}>Add</button>
              </div>
            </div>
            <div className="row">
              <div className="col-row">
                <div className="tag-container">
                  {
                    tags.map((tag, index) => (
                      <div className="tag">
                        <p key={index} className="tag-text">{tag}</p>
                        <button type="button" className="btn-delete-tag" onClick={() => handleDeleteTag(index)}>X</button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-row">
              <button type="submit" className="btn-post-job">Post Job</button>
            </div>
          </div>
        </form >
      </div >
    </>
  )

}

export default JobFormComponent