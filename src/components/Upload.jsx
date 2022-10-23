/* eslint-disable jsx-a11y/alt-text */
import React from "react";

const EXAMPLE_FILE = 'https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6.png'
const VERYFI_ENDPOINT_PROXY = 'https://transight-proxy.bwliang.workers.dev'

function Upload() {
  let [file, setFile] = React.useState(null)
  let [fileBlob, setFileBlob] = React.useState(EXAMPLE_FILE)
  
  const uploadFile = e => {
    setFile(e.target.files[0])
    setFileBlob(URL.createObjectURL(e.target.files[0]))
  }

  const getBase64 = () => {
    return new Promise(resolve => {
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const getReceiptData = async e => {
    e.preventDefault()

    getBase64()
      .then(async file => {
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify({ file })
        };
        const data = await (await fetch(VERYFI_ENDPOINT_PROXY, requestOptions)).json();
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="Upload">
      <div className="container">
        <div className="column align-items-center my-5">
          <form onSubmit={getReceiptData}>
            <div className="form-group">
              <label htmlFor="fileUpload">Upload Receipt Image:</label>
              <input type="file" encType="multipart/form-data" className="form-control" id="fileUpload" onChange={uploadFile} />
            </div>
            <div className="form-group">
              <label htmlFor="fileUpload">Preview:</label>
              <div>
                <img src={fileBlob} />
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