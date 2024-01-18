import { useState } from "react";
import PropTypes from "prop-types";

const UploadForm = (props) => {
  const [fileInfo, setFileInfo] = useState(null);
  const handleOnChangeOfInputFile = (event) => {
    const filesArr = event?.target?.files;
    const [fileInfo] = filesArr;
    console.log(fileInfo);
    setFileInfo(fileInfo);
  };

  const onUpload = () => {
    if (!fileInfo) return;
    const { setSelectedFile } = props;
    setSelectedFile(fileInfo);
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={handleOnChangeOfInputFile}
      />
      <button onClick={onUpload}>Upload</button>
    </div>
  );
};

export default UploadForm;
UploadForm.propTypes = {
  setSelectedFile: PropTypes.func.isRequired,
};
