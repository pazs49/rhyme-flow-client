export const login = async ({ email, password }) => {
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + "/users/tokens/sign_in",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const description =
      data.error_description?.[0] || data.error || "Failed to login";

    throw new Error(description);
  }

  return data;
};

export const signup = async ({ email, password }) => {
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + "/users/tokens/sign_up",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const description =
      data.error_description?.[0] || data.error || "Failed to login";

    throw new Error(description);
  }

  return data;
};

//Use for refreshing token and getting user info
export const getInfo = async (token) => {
  if (!localStorage.getItem("token")) return null;
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + "/users/tokens/info",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  // console.log("info", data);

  if (!response.ok) {
    const refreshToken = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/users/tokens/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
      }
    );

    const refreshData = await refreshToken.json();
    // console.log("refreshData", refreshData);

    if (!refreshToken.ok) {
      // localStorage.removeItem("token");
      // localStorage.removeItem("refresh_token");
      throw new Error("Login token failed, please login again.");
    }

    localStorage.setItem("token", refreshData.token);
    localStorage.setItem("refresh_token", refreshData.refresh_token);

    return refreshData.resource_owner;
  }

  return data;
};

export const logout = async () => {
  // const response = await fetch(
  //   import.meta.env.VITE_API_BASE_URL + "/users/tokens/revoke",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ token: localStorage.getItem("token") }),
  //   }
  // );
  // localStorage.removeItem("token");
  // localStorage.removeItem("refresh_token");
  // if (response.headers.get("Content-Type") === "application/json") {
  //   const data = await response.json();
  //   if (!response.ok) {
  //     const description =
  //       data.error_description?.[0] || data.error || "Failed to login";
  //     throw new Error(description);
  //   }
  //   return data;
  // } else {
  //   console.log("No JSON data returned from server");
  //   throw new Error("Failed to logout");
  // }

  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};
