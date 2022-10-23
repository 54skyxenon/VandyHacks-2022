/* eslint-disable jsx-a11y/alt-text */
import React from "react";

const EXAMPLE_FILE = 'https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6.png'
const VERYFI_ENDPOINT_PROXY = 'https://transight-proxy.bwliang.workers.dev'

function Upload() {
  let [file, setFile] = React.useState(null)
  let [fileBlob, setFileBlob] = React.useState(EXAMPLE_FILE)
  let [receiptData, setReceiptData] = React.useState({
    date: "--",
    address: "--",
    merchant: "--",
    items: [],
    tax: "--",
    total: "--",
    image: "--"
  })
  
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

        const purchase_items = []
        data.line_items.forEach(item => {
          purchase_items.push({name: item.description, price: item.total})
        })

        setReceiptData({
          date: data.date,
          address: data.vendor.address,
          merchant: data.vendor.name,
          items: JSON.stringify(purchase_items),
          tax: data.tax,
          total: data.total,
          image: data.pdf_url
        })

        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const persistToDB = async () => {

  }

  const processReceiptData = async e => {
    e.preventDefault()

    await doOcr()
    await persistToDB()
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
              <p>Date = {receiptData.date}</p>
              <p>Address = {receiptData.address}</p>
              <p>Merchant = {receiptData.merchant}</p>
              <p>Items = {String(receiptData.items)}</p>
              <p>Tax = {receiptData.tax}</p>
              <p>Total = {receiptData.total}</p>
              <p>Image = {receiptData.image}</p>
            </div>
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;