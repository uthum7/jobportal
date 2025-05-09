import JobFormComponent from "./JobFormComponent/JobFormComponent"
import "./postjob.css"

const PostJobComponent = () => {
    return (
        <>
            <div className="main-header">
                <h1>Post Job</h1>
            </div>
            <div className="form-component">
                <JobFormComponent/>
            </div>
        </>
    )
}

export default PostJobComponent