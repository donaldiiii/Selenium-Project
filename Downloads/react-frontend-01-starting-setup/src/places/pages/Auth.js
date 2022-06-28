import React, { useContext, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AuthContext from "../../auth-context";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import "./Auth.css";
import "../../shared/components/UIElements/LoadingSpinner.css";
const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },

      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLogin) {
      try {
   
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
           JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (error) {
        //log it probably
      }
    } else {
      try {
        
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value)
        formData.append('password', formState.inputs.password.value)
        formData.append('name', formState.inputs.name.value)
        formData.append('image', formState.inputs.image.value)
       
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData //fetchapi automatically puts the right header data when using formdata,
          
        );
        auth.login(responseData.userId, responseData.token);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image:{
            value:null,
            isValid:false
          }
        },
        false
      );
    }
    setIsLogin((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <Card className="authentication">
        {isLoading && <LoadingSpinner></LoadingSpinner>}
        <h2>{isLogin ? "Login" : "SignUp"} Required</h2>
        <hr></hr>
        <form onSubmit={authSubmitHandler}>
          {!isLogin && (
            <Input
              id="name"
              element="input"
              type="name"
              label="Name"
              validators={[VALIDATOR_MINLENGTH(3)]}
              errorText="enter correctly username"
              onInput={inputHandler}
            ></Input>
          )}
          {!isLogin && <ImageUpload center id="image" onInput={inputHandler} errorText='Provide an image or die'></ImageUpload>}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_MINLENGTH(3)]}
            errorText="enter correctly email"
            onInput={inputHandler}
          ></Input>
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="enter password email"
            onInput={inputHandler}
          ></Input>

          <Button type="submit" disabled={!formState.isValid}>
            {" "}
            {isLogin ? "Login" : "SignUp"}{" "}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {" "}
          Switch to {!isLogin ? "Login" : "SignUp"}{" "}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
