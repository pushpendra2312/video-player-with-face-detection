import React, { useEffect, useRef, useState } from "react";
import useFaceApi from "./useFaceApi";
import useCanvas from "./useCanvas";

const RefactoredCode = (props) => {
  const { selectedFile } = props;
  const { canvas } = useCanvas({ selectedFile });
  const { faceApiLoaded, faceapi } = useFaceApi();

  const videoElemRef = useRef(null);

  console.log("canvas value", canvas);

  useEffect(() => {
    if (selectedFile && videoElemRef.current) {
      console.log("selectedFile", selectedFile);
      assignSelectedFileToVideoElem(selectedFile);
    }
  }, [selectedFile]);

  const assignSelectedFileToVideoElem = (file) => {
    const blob = new Blob([file], { type: file.type });
    videoElemRef.current.src = URL.createObjectURL(blob);
    videoElemRef.current.type = file.type;
  };

  return (
    <div>
      {/* <canvas id="canvas"></canvas> */}
      <video ref={videoElemRef} autoPlay={true} loop={true}></video>
    </div>
  );
};

export default RefactoredCode;
