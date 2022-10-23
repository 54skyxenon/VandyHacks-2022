import React, {useState, useEffect} from "react";

const FLASK_ENDPOINT = 'http://127.0.0.1:5000/'

const Home = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
        const backendData = await (await fetch(FLASK_ENDPOINT + 'data', {method: 'GET'})).json()
        const newTransactions = []
        backendData.receipts.forEach(transaction => {
          newTransactions.push({
            "date": transaction.date,
            "merchant": transaction.merchant,
            "total": transaction.total
          })
        })
        setTransactions(newTransactions)
    }
    loadData()
  }, []);

  return (
    <div className="home">
      <div className="container">
        <div className="column align-items-center my-5">
          <div className="col-lg-7">
            <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src="https://picsum.photos/900/400"
              alt=""
            />
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-light">Home</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div>
            <table striped width="99%">
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
                  <tr>
                    <td>{i + 1}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.merchant}</td>
                    <td>{transaction.total}</td>
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