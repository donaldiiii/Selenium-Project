import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => { //GET EXECUTED AFTER READING FILE
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  return (
    <div className="form-control">
      <input
        type="file"
        ref={filePickerRef}
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      ></input>
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
         {previewUrl && <img src={previewUrl} alt="Preview"></img>}
         {!previewUrl && <p> Please Provide an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && props.errorText}
    </div>
  );
};
export default ImageUpload;
