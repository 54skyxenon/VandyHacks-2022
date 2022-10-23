/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { FLASK_ENDPOINT } from "./constants";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionState, setTransactionState] = useState({
    isShown: false,
    date: "",
    merchant: "",
    address: "",
    items: [],
    tax: "",
    tip: "",
    total: "",
    currency: ""
  });

  const handleClose = () => setTransactionState({...transactionState, isShown: false});
  const handleShow = transaction => {
    console.log(typeof JSON.parse(transaction.items))
    console.log("ITEMS: " + JSON.parse(transaction.items))
    setTransactionState({
      ...transactionState,
      date: transaction.date,
      merchant: transaction.merchant,
      address: transaction.address,
      items: JSON.parse(transaction.items),
      tax: transaction.tax.toFixed(2),
      tip: transaction.tip.toFixed(2),
      total: transaction.total.toFixed(2),
      currency: transaction.currency,
      isShown: true
    });
  }
  const refreshPage = () => {window.location.reload()}
  const handleDelete = async rid => {
    const deleteOptions = {
      method: 'DELETE',
      body: JSON.stringify({rid})
    }
    await fetch(FLASK_ENDPOINT + 'data', deleteOptions)
    refreshPage()
  }

  useEffect(() => {
    const loadData = async () => {
      const backendData = await (await fetch(FLASK_ENDPOINT + 'data', {method: 'GET'})).json()
      const newTransactions = []
      backendData.receipts.forEach(transaction => {
        newTransactions.push(transaction)
      })
      setTransactions(newTransactions)
    }
    loadData()
  }, []);

  return (
    <div className="home">
      <div className="container">
      <Modal show={transactionState.isShown} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>Transaction Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h5><u>Date:</u> {transactionState.date}</h5>
            <h5><u>Merchant:</u> {transactionState.merchant}</h5>
            <h5><u>Address:</u> {transactionState.address}</h5>
            <h5><u>Items:</u> </h5>
            <ul>
              {transactionState.items.map((item, j) => 
                  <li key={j}>
                    {item.name} - {item.price} {transactionState.currency}
                  </li>
              )}
            </ul>
            <h5><u>Tax:</u> {transactionState.tax} {transactionState.currency}</h5>
            <h5><u>Tip:</u> {transactionState.tip} {transactionState.currency}</h5>
            <h5><u>Total:</u> {transactionState.total} {transactionState.currency}</h5>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        <div className="column align-items-center my-5">
          <div className="col-lg-7">
            <img
              className="img-fluid rounded"
              src="/logo.png"
              alt=""
            />
          </div>
          {/* <div className="col-lg-5">
            <h1 className="font-weight-light">Home</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div> */}
          <div>
            <table width="80%">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Merchant</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, i) => 
                  <tr key={transaction.rid}>
                    <td>{i + 1}</td>
                    <td>{transaction.date}  
                      <a href={"#"} onClick={() => handleShow(transaction)}> (Click for details) </a>
                      <a href={"#"} onClick={() => handleDelete(transaction.rid)}> (Delete) </a>
                    </td>
                    <td>{transaction.merchant}</td>
                    <td>{transaction.total.toFixed(2)} {transaction.currency}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Home;