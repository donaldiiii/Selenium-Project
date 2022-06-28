import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UsersList from "../components/UsersList";

const Users = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users"
        );
        setLoadedUsers(responseData.users);
      } catch (error) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}>
        {isLoading && (
          <div className="center">
            <LoadingSpinner></LoadingSpinner>
          </div>
        )}
      </ErrorModal>
      {!isLoading && loadedUsers && <UsersList items={loadedUsers}></UsersList>}
    </React.Fragment>
  );
};
export default Users;
