import { useState } from 'react'
import './App.css'
import { FaUpload } from "react-icons/fa6";
import axios from 'axios';

function App() {

  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the selected file in the state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const formData = new FormData();
    console.log(isSubmitted);
    console.log(file);
    
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage("File Successfully uploaded");
    } catch (error) {
      console.log(error);
      
      setMessage('Error uploading file');
    }
  };


  return (
    <div className='home'>
      <div className='header'>
        Add Candiates to the Database
      </div>
      <div className='uploadDiv'>
        {
          isSubmitted ? <div className='submitDiv'>
            <span className='spanThank'>Thank You!</span>
            <div className='divTickFile'><span className='spanTick'>✔</span>
            <span className='spanFile'>{message}</span>
            </div>
            <p className='spanRecord'>Your records will be processed shortly</p>
          </div> : <form onSubmit={handleSubmit} className='form'>
          <div className='btnDiv'>
            <FaUpload className='uploadIcon' style={{ fontSize: "25px"}} />
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          </div>

            {file && <p className='fileName'>{file.name}</p>}

            {file ? (
              <button className='submitBtn' type='submit'>Submit</button>
            ) : (
              <span>Upload a .xlsx or .xls file here</span>
            )}

            </form>
        }
      </div>
    </div>
  )
}

export default App
