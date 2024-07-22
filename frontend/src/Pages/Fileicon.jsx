import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from 'xlsx';
import "./Fileicon.css";
import axios from "axios";

const Fileicon = () => {
  const fileInputRef = useRef(null);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    let fileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    let selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };

        // Upload the file
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
          const response = await axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('File uploaded successfully:', response.data);
          setUploadStatus("File has been uploaded successfully");
        } catch (error) {
          console.error('Error uploading file:', error);
          setUploadStatus("Error uploading file");
        }
      } else {
        setTypeError('Please select only excel file types');
        setExcelFile(null);
        setUploadStatus("");
      }
    } else {
      console.log('Please select your file');
      setUploadStatus("");
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));
    }
  };

  return (
    <div className="file-icon-container">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".xls,.xlsx,.csv"
        onChange={handleFileChange}
      />
      <button className="icon-button" onClick={handleIconClick}>
        <FontAwesomeIcon icon={faFileUpload} size="2x" />
      </button>
      <h1 className="head-x">Upload the File</h1>
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <button type="submit" className="btn btn-success btn-md">View Data</button>
        {typeError && (
          <div className="alert alert-danger" role="alert">{typeError}</div>
        )}
      </form>

      <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key}>{individualExcelData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No File is uploaded yet!</div>
        )}
      </div>
    </div>
  );
};

export default Fileicon;
