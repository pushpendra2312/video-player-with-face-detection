import { useState } from "react";
import "./App.css";
import UploadForm from "./UploadForm";
import FabricCanvas from "./FabricCanvas";
import RefactoredCode from "./FabricCanvas/RefactoredCode";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <>
      <UploadForm setSelectedFile={setSelectedFile} />
      <FabricCanvas selectedFile={selectedFile} />
      {/* <RefactoredCode selectedFile={selectedFile} /> */}
    </>
  );
}

export default App;
