/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import {EXAMPLE_FILE, VERYFI_ENDPOINT_PROXY, FLASK_ENDPOINT} from './constants';

const Upload = () => {
  let [file, setFile] = React.useState(null)
  let [fileBlob, setFileBlob] = React.useState(EXAMPLE_FILE)
  let [receiptSuccess, setReceiptSuccess] = React.useState(false)
  
  const uploadFile = e => {
    setFile(e.target.files[0])
    setFileBlob(URL.createObjectURL(e.target.files[0]))
  }

  // Transform file contents to base64 for API
  const getBase64 = () => {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  // Call OCR API and set state here
  const doOcr = async () => {
    getBase64()
      .then(async file => {
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify({ file })
        };

        const data = await (await fetch(VERYFI_ENDPOINT_PROXY, requestOptions)).json();
        console.log(data)

        const purchase_items = []
        data.line_items.forEach(item => {
          purchase_items.push({name: item.description, price: item.total})
        })

        const newReceiptData = {
          date: data.date,
          address: data.vendor.address,
          merchant: data.vendor.name,
          items: JSON.stringify(purchase_items),
          tax: data.tax,
          total: data.total,
          currency: data.currency_code,
          ref_number: data.reference_number
        }

        await setReceiptSuccess(true)
        await persistToDB(newReceiptData)
      })
      .catch(err => {
        console.log(err);
      });
  }

  const persistToDB = async receipt => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(receipt)
    };
    await (await fetch(FLASK_ENDPOINT + 'data', requestOptions)).json()
  }

  const processReceiptData = async e => {
    e.preventDefault()

    await doOcr()
  }

  return (
    <div className="Upload">
      <div className="container">
        <div className="column align-items-center my-5">
          <form onSubmit={processReceiptData}>
            <div className="form-group">
              <label htmlFor="fileUpload">Upload Receipt Image:</label>
              <input type="file" encType="multipart/form-data" className="form-control" id="fileUpload" onChange={uploadFile} />
            </div>
            <div className="form-group">
              <label>Preview:</label>
              <div>
                <img src={fileBlob} />
              </div>
            </div>
            <div className="form-group">
              {
                receiptSuccess ? ("Successfully uploaded!") : ("")
              }
            </div>
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;