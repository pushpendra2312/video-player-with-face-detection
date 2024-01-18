import * as faceapi from "face-api.js";
import { useEffect, useState } from "react";

const MODEL_URL = "/models";

const useFaceApi = () => {
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);

  const loadModels = async () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      console.log("models loaded");
      setFaceApiLoaded(true);
    });
  };

  useEffect(() => {
    loadModels();
  }, []);

  return { faceApiLoaded, faceapi };
};
export default useFaceApi;
