import { useState } from "react";

const UploadForm = () => {
    const [fileInfoState,setFileInfo] = useState(null);
    console.log(fileInfoState)
    const handleOnChangeOfInputFile = (event) =>{
        const filesArr = event?.target?.files;
        const [fileInfo] = filesArr;
        console.log(fileInfo);
        setFileInfo(fileInfo);
    }

    const onUpload = () => {
        if(!fileInfoState)return;
        alert("Upload btn is clicked")
    }

  return (
    <div>
        <input type="file" accept="video/*" onChange={handleOnChangeOfInputFile} />
        <button onClick={onUpload}>Upload</button>
    </div>
  )
}

export default UploadForm