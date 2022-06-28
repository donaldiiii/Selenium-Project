import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  var userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.userWithPlaces);
      } catch (error) {
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);
  const placeDeletedHandler = (deletedPlaceId) =>{
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId ));
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}></PlaceList>}
    </React.Fragment>
  );
};

export default UserPlaces;
