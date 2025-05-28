export const rubyHashToJson = (data) => {
  let parsedRubyHash = {};
  try {
    const fixedJson = data.replace(/"=>"/g, '":"').replace(/" => "/g, '": "');
    parsedRubyHash = JSON.parse(fixedJson);
  } catch (e) {
    console.error("Error parsing JSON:", e);
  }

  return parsedRubyHash;
};
