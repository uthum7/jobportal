import "./formstyle.css";
import { useRef } from "react";
const JobFormComponent = () => {


  const title = useRef("");
  const location = useRef("");
  const employmentType = useRef("");
  const deadline = useRef("");
  const jobType = useRef("");
  const mode = useRef("");
  const jobDescription = useRef("");


  const handleSubmit = (e) => {
    e.preventDefault();
    alert(title.current.value + location.current.value + employmentType.current.value + deadline.current.value + jobType.current.value + mode.current.value + jobDescription.current.value);
  }
  return (
    <>
      <div className="job-form-component">
        <div className="job-form-component-header">
          <h3>Basic Details</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <div className="label">Job Title</div>
              <input type="text" ref={title} className="input-text" />
            </div>
            <div className="col  col-left">
              <div className="label">Location</div>
              <input type="text" ref={location} className="input-text" />
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
              </select>
            </div>


          </div>

          <div className="row">
            <div className="col-row">
              <div className="label">Job Description</div>
              <textarea name="job-description" id="job-description" ref={jobDescription} className="description" placeholder="Enter Job Description" rows="10"></textarea>
            </div>
          </div>

          <div className="row">
            <div className="col-row">
              <button type="submit" className="btn-post-job">Post Job</button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default JobFormComponent