import { useState, useCallback } from 'react'
import './App.css';
import MyDropzone from "./components/react-dropzone"

function App() {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejected] = useState([]);

  const setAcceptedFiles = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const setRejectedFiles = useCallback((Files) => {
    setRejected(Files);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (rejectedFiles.length > 0) {
      alert('Please remove rejected files before submitting');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(file.name, file);
    });
    // const res = await fetch('http://localhost:3000/upload', {
    //   method: 'POST',
    //   body: formData
    // });
    // console.log(await res.json());
    console.log(Object.fromEntries(formData.entries()));
  }, [files, rejectedFiles]);

  return (
    <form onSubmit={handleSubmit}>
      <h1>Upload your files</h1>
      <MyDropzone 
        files={files} 
        setFiles={setAcceptedFiles} 
        rejectedFiles={rejectedFiles} 
        setRejectedFiles={setRejectedFiles} 
      />
      <button 
        type="submit" 
        className="submit-button"
        disabled={rejectedFiles.length > 0}
      >
        {rejectedFiles.length > 0 ? 'Remove rejected files first' : 'Submit'}
      </button>
    </form>
  )
}

export default App
