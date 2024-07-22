import React from "react";
import "./Home.css";
import ImageSlider from "./slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function Home() {

  const home={
    backgroundImage: 'linear-gradient(#1E407E,#484797,#4E2A6D)'
  };
  return (
    <>
      

      <div className="slider-div">
        <ImageSlider />
      </div>

      <div className="quote">
        <p className="line1">
          Unleash the potential of AI to understand your customers better{" "}
        </p>
        <br />
        <p className="line2">and drive personalised marketing efforts</p>
      </div>
      <div className="heading">
        <h1>Our Services</h1>
      </div>
      <div className="para1">
        <div className="para1-img">
          <img className="p-img" src="p1.png" alt="" srcset="" />
        </div>
        <div className="para-txt">
          <h1 className="head-t">Customer Loyalty Prediction</h1>
          <p className="p-text">
            Harness the power of AI to accurately predict customer loyalty and
            lifetime value. Our advanced machine learning models analyze
            customer data to identify high-value customers, enabling you to
            tailor loyalty programs that boost retention and enhance customer
            satisfaction.
          </p>
        </div>
      </div>

      <div className="para1">
        <div className="para-txt">
          <h1 className="head-t">Sentiment Analysis or Brand Reputation</h1>
          <p className="p-text">
          Stay ahead of the curve with real-time sentiment analysis for brand reputation management. Our NLP tools sift through social media and customer reviews to gauge public perception, providing you with actionable insights to protect and improve your brand's image.
          </p>
        </div>
        <div className="para2-img">
          <img className="p-img" src="p2.png" alt="" srcset="" />
        </div>
      </div>

      <div className="para1">
        <div className="para1-img">
          <img className="p-img" src="p3.png" alt="" srcset="" />
        </div>
        <div className="para-txt">
          <h1 className="head-t">Churn Prediction and Prevention</h1>
          <p className="p-text">
          Reduce customer attrition with our predictive churn analysis. By identifying customers at risk of leaving, our AI-driven solution offers personalized retention strategies to keep them engaged, ensuring long-term customer loyalty and reducing turnover rates.
          </p>
        </div>
      </div>
      <div className="icon">
      <Link style={{color:"black"}} to={"https://7cxkjpt1-8501.inc1.devtunnels.ms/"}>
      <FontAwesomeIcon icon={faRobot} />
      
      </Link>
      </div>
    </>
  );
}

export default Home;
