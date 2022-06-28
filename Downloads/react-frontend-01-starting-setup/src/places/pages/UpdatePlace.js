import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import AuthContext from "../../auth-context";
const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const [ loadedPlace, setLoadedPlace ] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
       await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' +  auth.token
        }
        
      );
      history.push("/" + auth.userId + '/places');

    } catch (error) {}
  };
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        isValid: true,
        value: "",
      },
      description: {
        isValid: true,
        value: "",
      },
    },
    true
  );
  useEffect(() => {
    try {
      const fetchPlace = async () => {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        if (responseData.place) {
          setFormData({
            title: { value: responseData.place.title, isValid: true },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          });
        }
      };
      fetchPlace();
    } catch (error) {}
  }, [sendRequest, placeId, setFormData]);

  if (isLoading) {
    return (
      <div className="center">
        <h2>
          {" "}
          <LoadingSpinner></LoadingSpinner>{" "}
        </h2>
      </div>
    );
  }
  if (!loadedPlace && !error) {
    return (
      <Card>
        <div className="center">Not Found</div>;
      </Card>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          ></Input>
          {/*  */}
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid desc"
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          ></Input>
          <Button type="submit" disabled={!formState.isValid}>
            Update Place{" "}
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
