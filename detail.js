"use strict";

// 1. Get record ID from URL
const params = new URLSearchParams(window.location.search);
const recordId = params.get("id");

// 2. Airtable API
const url = `https://api.airtable.com/v0/appd2bG7WHqaMZuiX/Table%201/${recordId}`;

async function getDetails() {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer patkwXt1bmB9NocbI.2b2a3d222bc5c0de05595653a9c2fede447921fd0718fb14611729909c8aa5ba`,
      },
    });

    const data = await response.json();
    const fields = data.fields;

    // 3. Assign fields
    document.getElementById("poi").textContent = fields["POIs"] || "Unknown";

    document.getElementById("rating").textContent = fields["Rating"]
      ? `${fields["Rating"]}★`
      : "No Rating";

    document.getElementById("address").textContent =
      fields["Address"] || "Not available";

    document.getElementById("phone").textContent =
      fields["Phone"] || "Not available";

    document.getElementById("description").textContent =
      fields["Description"] || "No description available.";

    document.getElementById("hours").textContent =
      fields["Hours"] || "No hours available.";

    document.getElementById("prices").textContent =
      fields["Prices"] || "No pricing available.";

    document.getElementById("reviews").textContent =
      fields["Reviews"] || "No reviews available.";

    // IMAGE2
    if (fields["Image2"]) {
      document.getElementById("image2").src = fields["Image2"][0].url;
    } else {
      document.getElementById("image2").style.display = "none";
    }
  } catch (error) {
    console.error("Error loading details:", error);
  }
}

getDetails();
