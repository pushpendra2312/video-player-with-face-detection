import { fabric } from "fabric";
import { useEffect, useState } from "react";

const useCanvas = ({ selectedFile }) => {
  const [canvas, setCanvas] = useState(null);

  const initCanvas = () => {
    const canvasConfigObj = {
      backgroundColor: "pink",
      width: 100,
      height: 100,
      renderOnAddRemove: false, // read from documentation
      preserveObjectStacking: true, // read from documentation
    };

    const canvasObj = new fabric.Canvas("canvas", canvasConfigObj);
    console.log("Canvas Library Initialized");
    setCanvas(canvasObj);
  };

  useEffect(() => {
    if (!selectedFile) return;
    initCanvas();
  }, [selectedFile]);

  return { canvas };
};

export default useCanvas;
