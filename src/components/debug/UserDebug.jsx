import React from "react";
import { useAuthUser } from "react-auth-kit";

const UserDebug = () => {
  const user = useAuthUser();

  // Debug localStorage
  const authData = localStorage.getItem("_auth");
  let parsedAuth = null;
  let authDataType = "unknown";

  if (authData) {
    if (authData.startsWith("eyJ")) {
      authDataType = "JWT Token";
      parsedAuth = { token: authData, type: "JWT" };
    } else {
      authDataType = "JSON";
      try {
        parsedAuth = JSON.parse(authData);
      } catch (error) {
        console.error("Error parsing auth data:", error);
        authDataType = "Invalid JSON";
      }
    }
  } else {
    authDataType = "Not found";
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>User Debug Information</h3>

      <div>
        <h4>useAuthUser() result:</h4>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div>
        <h4>Raw localStorage _auth:</h4>
        <p>
          <strong>Type:</strong> {authDataType}
        </p>
        <pre>{authData}</pre>
      </div>

      <div>
        <h4>Parsed localStorage _auth:</h4>
        <pre>{JSON.stringify(parsedAuth, null, 2)}</pre>
      </div>

      <div>
        <h4>User type:</h4>
        <p>{typeof user}</p>
      </div>

      <div>
        <h4>Is user a function?</h4>
        <p>{typeof user === "function" ? "Yes" : "No"}</p>
      </div>

      {typeof user === "function" && (
        <div>
          <h4>Function result:</h4>
          <pre>{JSON.stringify(user(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UserDebug;
