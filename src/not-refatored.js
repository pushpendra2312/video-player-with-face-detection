import React, { useEffect, useState } from "react";
import Prototypes from "prop-types";
import { fabric } from "fabric";
import * as faceapi from "face-api.js";

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const BTN_HEIGHT = 40;

const MODEL_URL = "/models";

const FabricCanvas = (props) => {
  const { selectedFile } = props;

  const [canvasState, setCanvasState] = useState(null);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);

  const initCanvas = (videoDimensions) => {
    console.log("videoDimensions", videoDimensions);
    const canvasObj = {
      backgroundColor: "pink",
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      renderOnAddRemove: false, // read from documentation
      preserveObjectStacking: true, // read from documentation
      // hasControls: false,
    };

    console.log("canvasObj", canvasObj);

    return new fabric.Canvas("canvas", canvasObj);
  };

  const addVideo = (videoElement, videoDimensions) => {
    console.log("canvasState", canvasState);
    if (canvasState) {
      canvasState.dispose();
    }

    const canvas = initCanvas(videoDimensions);

    fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
      console.log(
        "inside proto getAbsoluteCoords",
        this._offset.left,
        object,
        this._offset
      );

      return {
        left: object.left + this._offset.left,
        top: object.top + this._offset.top,
      };
    };

    setCanvasState(canvas);

    const fabricVideoObj = {
      left: 0,
      top: 0,
      angle: 0,
      objectCaching: false,
      hasControls: false,
      selectable: false,
    };

    const videoFabricElem = new fabric.Image(videoElement, fabricVideoObj);

    console.log(
      "findScaleToFit",
      fabric.util.findScaleToFit(videoFabricElem, canvas)
    );

    const scaleToFit = fabric.util.findScaleToFit(videoFabricElem, canvas);

    videoFabricElem.scale(scaleToFit);
    fabric.Object.scaleToWidth;

    canvas.add(videoFabricElem);

    // fabric.Group.prototype.hasControls = false;

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });

    console.log(canvas.getAbsoluteCoords(videoFabricElem));
    videoFabricElem.on("moving", () => {
      positionBtn(canvas, videoFabricElem);
    });
    videoFabricElem.on("scaling", () => {
      positionBtn(canvas, videoFabricElem);
    });
    positionBtn(canvas, videoFabricElem);
  };

  const positionBtn = (canvas, videoFabricElem) => {
    const absCoords = canvas.getAbsoluteCoords(videoFabricElem);
    const btn = document.getElementById("btn");
    btn.style.left = absCoords.left + "px";
    btn.style.top = absCoords.top + CANVAS_HEIGHT - BTN_HEIGHT + "px";
  };

  useEffect(() => {
    if (!selectedFile) return;

    if (document.getElementById("videoElement")) {
      document.getElementById("videoElement").remove();
    }

    const blob = new Blob([selectedFile], { type: selectedFile.type });
    console.log("BLOB", blob);

    const videoElement = document.createElement("video");
    videoElement.setAttribute("id", "videoElement");
    videoElement.style.display = "none";
    videoElement.controls = true;
    videoElement.src = URL.createObjectURL(blob);
    videoElement.type = selectedFile.type;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.addEventListener("loadedmetadata", (e) => {
      console.log(
        "videoElement",
        videoElement?.videoWidth,
        videoElement?.videoHeight
      );
      videoElement.width = videoElement?.videoWidth;
      videoElement.height = videoElement?.videoHeight;
    });
    document.body.appendChild(videoElement);
    // const canvas = initCanvas();
    // setCanvasState(canvas);
    setTimeout(() => {
      addVideo(videoElement, {
        width: videoElement.width,
        height: videoElement.height,
      });
    }, 1000);
  }, [selectedFile]);

  useEffect(() => {
    if (!canvasState) return;

    detectFaces();
  }, [canvasState]);

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

  const detectFaces = async () => {
    setInterval(async () => {
      const video = document.getElementById("videoElement");
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      console.log("detections", detections);
      const resizedDetections = faceapi.resizeResults(detections, {
        width: 1280,
        height: 720,
      });
      console.log("resizedDetections", resizedDetections);

      const rectArr = resizedDetections.map((detection) => {
        const { x, y, width, height } = detection.alignedRect.box;
        return {
          left: Math.floor(x),
          top: Math.floor(y),
          width: Math.floor(width),
          height: Math.floor(height),
        };
      });

      createRects(rectArr);
    }, 100);
  };

  const createRects = (rectArr) => {
    // console.log("canvasState", canvasState);
    canvasState.getObjects("rect").forEach((rect) => {
      if (canvasState.contains(rect)) {
        canvasState.remove(rect);
      }
    });

    rectArr.map((rect) => {
      const rectElem = new fabric.Rect({
        left: rect.left,
        top: rect.top,
        angle: 0,
        objectCaching: false,
        hasControls: false,
        selectable: false,
        fill: "transparent",
        stroke: "red",
        strokeWidth: 2,
        width: rect.width,
        height: rect.height,
      });
      canvasState.add(rectElem);
    });

    canvasState.renderAll();
  };

  return (
    <div>
      <canvas id="canvas"></canvas>
      <button
        id="btn"
        style={{ position: "absolute", height: `${BTN_HEIGHT}PX` }}
      >
        Click me
      </button>
    </div>
  );
};

export default FabricCanvas;

FabricCanvas.propTypes = {
  selectedFile: Prototypes.object,
};
