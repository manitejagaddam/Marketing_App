import React, { useState } from "react";
import axios from "axios";
import "./Tabs.css";

const TableComponent = () => {
  const [data, setData] = useState([]);

  const handleButtonClick = async (url) => {
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="table-container">
      <div className="button-row">
        <button
          className="table-button"
          onClick={() => handleButtonClick("https://api.example.com/data1")}
        >
          Loyalty
        </button>
        <button
          className="table-button"
          onClick={() => handleButtonClick("https://api.example.com/data2")}
        >
          Sentiment
        </button>
        <button
          className="table-button"
          onClick={() => handleButtonClick("https://api.example.com/data3")}
        >
          Churn
        </button>
      </div>
      <div className="table-div">
      <table className="data-table">
        
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
              <td>{row.column3}</td>
              <td>{row.column4}</td>
              <td>{row.column5}</td>
              <td>{row.column6}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    </div>
  );
};

export default TableComponent;
