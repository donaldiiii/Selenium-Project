import React, { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceList.css";
import AuthContext from "../../auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => {
    return setShowMap(false);
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
    } catch (error) {}
    props.onDelete(props.id);
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contenctClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="are u sure?"
        footerClass="place-item__modal-acions"
        footer={
          <React.Fragment>
            <Button onClick={cancelDeleteHandler} inverse>
              Cancel
            </Button>
            <Button onClick={confirmDeleteHandler} danger>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Do u want to delete the item?</p>
      </Modal>
      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button onClick={openMapHandler} inverse>
              View Map
            </Button>
            {auth.userId === props.creator && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creator && (
              <Button onClick={showDeleteWarningHandler} danger>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
