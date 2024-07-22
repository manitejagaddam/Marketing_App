import React, { useState } from "react";
import Fileicon from "./Fileicon";
import Tabs from "./Tabs";
import "./Predict.css";

const Predict = () => {
  const [showTable, setShowTable] = useState(false);

  return (
    <>
      <div className="box">
      </div>
      <div className="btn">
        {!showTable && (
          <button
            type="submit"
            className="predict-btn"
            onClick={() => setShowTable(true)}
          >
            Predict
          </button>
        )}
        {showTable && <Tabs />}
      </div>
      
      <div className="box">
      <Fileicon />

      </div>
    </>
  );
};

export default Predict;
