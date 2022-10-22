/* eslint-disable jsx-a11y/alt-text */
import React from "react";

const EXAMPLE_FILE = 'https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6.png'

function Upload() {
  let [file, setFile] = React.useState(EXAMPLE_FILE)
  
  const uploadFile = e => {
    setFile(URL.createObjectURL(e.target.files[0]))
  }

  return (
    <div className="Upload">
      <div className="container">
        <div className="column align-items-center my-5">
          <form onSubmit={() => {
            alert('Submitted!')
          }}>
            <div className="form-group">
              <label htmlFor="fileUpload">Upload Receipt Image:</label>
              <input type="file" className="form-control" id="fileUpload" onChange={uploadFile} />
            </div>
            <div className="form-group">
              <label htmlFor="fileUpload">Preview:</label>
              <div>
                <img src={file} />
              </div>
            </div>
            <button className="btn btn-primary">Submit</button>
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default Upload;