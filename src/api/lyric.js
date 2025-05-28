export const createLyric = async ({ lyricInfo }) => {
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + "/api/v1/lyrics/generate_lyric",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ lyric: lyricInfo }),
    }
  );

  console.log(JSON.stringify({ lyric: lyricInfo }));

  const data = await response.json();

  if (!response.ok) {
    const description =
      data.error_description?.[0] || data.error || "Failed to fetch lyrics";

    throw new Error(description);
  }

  // console.log(data);

  return data;
};

export const getAllLyrics = async () => {
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + "/api/v1/lyrics",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await response.json();
  console.log("lyrics of all users:", data);
  if (!response.ok) {
    const description =
      data.error_description?.[0] || data.error || "Failed to fetch lyrics";

    throw new Error(description);
  }

  return data;
};

export const getAllUserLyrics = async () => {
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + "/api/v1/lyrics/user_lyrics",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await response.json();
  console.log("lyrics of current user:", data);
  if (!response.ok) {
    const description =
      data.error_description?.[0] || data.error || "Failed to create lyric";

    throw new Error(description);
  }

  return data;
};

export const likeLyric = async ({ lyricId }) => {
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + `/api/v1/lyrics/${lyricId}/like`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const description =
      data.error_description?.[0] || data.error || "Failed to like lyric";

    throw new Error(description);
  }

  return data;
};

export const commentOnLyric = async ({ lyricId, comment }) => {
  console.log("lyricId", lyricId);
  console.log("commentBody", comment);
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + `/api/v1/lyrics/${lyricId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ comment: { body: comment } }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const description =
      data.error_description?.[0] || data.error || "Failed to create lyric";

    throw new Error(description);
  }

  return data;
};
