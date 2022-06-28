import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AuthContext from "../../auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./PlaceForm.css";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  // define dependencies on function on which this component should rerender,
  // second argument we leave it empty bcause create infinite loop with useEffect
  //so function in the callback stored away in react and gets reused

  const history = useHistory();
  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("creator", auth.userId);

      await sendRequest("http://localhost:5000/api/places", "POST", formData, {
        Authorization:'Bearer ' + auth.token
      });
    } catch (error) {
      console.log(error);
    }
    history.push("/");
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay> </LoadingSpinner>}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter valid title"
          onInput={inputHandler}
        ></Input>
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          errorText="Provide an image or die"
        ></ImageUpload>
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter valid desc"
          onInput={inputHandler}
        ></Input>
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter valid address"
          onInput={inputHandler}
        ></Input>

        <Button type="submit" disabled={!formState.isValid}>
          Submit
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
