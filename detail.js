"use strict";

/* ---------------------------
  Utility: convert Airtable text to <li> list
  Handles leading commas, newlines, extra spaces.
---------------------------- */
function convertAirtableList(text) {
  if (!text && text !== "") return ""; // undefined/null guard
  // normalize to string (in case it's something odd)
  const raw = String(text);

  return raw
    .split(",") // split on commas
    .map((item) => item.replace(/\r/g, "")) // remove CR if present
    .map((item) => item.trim()) // trim spaces/newlines
    .filter((item) => item.length > 0) // drop empty items
    .map((item) => `<li>${escapeHtml(item)}</li>`) // wrap as <li>, escape html
    .join("");
}

/* ---------------------------
  Small helper to prevent HTML injection
---------------------------- */
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ---------------------------
  Read record id from URL
---------------------------- */
const params = new URLSearchParams(window.location.search);
const recordId = params.get("id");

if (!recordId) {
  // show basic error if no id provided
  document.body.innerHTML =
    "<p style='padding:20px;color:#fff'>No record id provided in the URL.</p>";
  throw new Error("No record id in URL");
}

/* ---------------------------
  Airtable fetch (replace API key)
---------------------------- */
const url = `https://api.airtable.com/v0/appd2bG7WHqaMZuiX/Table%201/${recordId}`;

async function getDetails() {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer patkwXt1bmB9NocbI.2b2a3d222bc5c0de05595653a9c2fede447921fd0718fb14611729909c8aa5ba`, // ← REPLACE with your key (keep secure)
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Airtable error:", res.status, text);
      showFetchError("Failed to fetch record from Airtable.");
      return;
    }

    const data = await res.json();
    const fields = data.fields || {};

    // Simple text fields
    setText("#poi", fields["POIs"] || "Unknown");
    setText("#rating", fields["Rating"] ? `${fields["Rating"]}★` : "—");
    setText("#address", fields["Address"] || "Not available");
    setText("#phone", fields["Phone"] || "Not available");

    // Description & reviews as centered text (use textContent to preserve plain text)
    setText(
      "#description",
      fields["Description"] || "No description available."
    );
    setText("#reviews", fields["Reviews"] || "No reviews available.");

    // Image2
    if (
      fields["Image2"] &&
      Array.isArray(fields["Image2"]) &&
      fields["Image2"][0] &&
      fields["Image2"][0].url
    ) {
      const img = document.getElementById("image2");
      img.src = fields["Image2"][0].url;
      img.style.display = ""; // in case CSS had it hidden earlier
    } else {
      const img = document.getElementById("image2");
      if (img) img.style.display = "none";
    }

    // Convert Hours and Prices into <ul>
    const hoursHtml = convertAirtableList(fields["Hours"] || "");
    const pricesHtml = convertAirtableList(fields["Prices"] || "");

    const hoursEl = document.getElementById("hours");
    const pricesEl = document.getElementById("prices");

    if (hoursEl)
      hoursEl.innerHTML = hoursHtml
        ? `<ul>${hoursHtml}</ul>`
        : "<p>No hours available.</p>";
    if (pricesEl)
      pricesEl.innerHTML = pricesHtml
        ? `<ul>${pricesHtml}</ul>`
        : "<p>No pricing available.</p>";
  } catch (err) {
    console.error("Error loading details:", err);
    showFetchError("An unexpected error occurred while loading details.");
  }
}

/* ---------------------------
  Helper: set text safely (textContent)
---------------------------- */
function setText(selector, text) {
  const el = document.querySelector(selector);
  if (!el) return;
  // If element is intended to hold HTML lists (#hours/#prices), caller sets innerHTML instead.
  el.textContent = text;
}

/* ---------------------------
  Show a small error message inside the page
---------------------------- */
function showFetchError(msg) {
  const container = document.querySelector(".container");
  if (container) {
    container.innerHTML = `<div style="padding:20px;border-radius:8px;background:#fff;color:#333">${escapeHtml(
      msg
    )}</div>`;
  } else {
    alert(msg);
  }
}

getDetails();
