"use strict";

const url =
  "https://api.airtable.com/v0/appd2bG7WHqaMZuiX/Table%201?maxRecords=10&view=Grid%20view";

async function getAllRecords() {
  const rows = [
    document.getElementById("row1"), // 3 cards
    document.getElementById("row2"), // 2 cards
    document.getElementById("row3"), // 3 cards
    document.getElementById("row4"), // 2 cards
  ];

  const rowStructure = [3, 2, 3, 2]; // how many cards per row

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patkwXt1bmB9NocbI.2b2a3d222bc5c0de05595653a9c2fede447921fd0718fb14611729909c8aa5ba





`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Flatten
    const records = data.records.slice(0, 10);

    let recordIndex = 0;

    for (let row = 0; row < rows.length; row++) {
      let html = "";

      for (let i = 0; i < rowStructure[row]; i++) {
        const record = records[recordIndex];
        if (!record) break;

        const fields = record.fields;
        const poi = fields["POIs"] || "No Title";
        const image1 = fields["Image1"] ? fields["Image1"][0].url : null;

        const detailPageUrl = `detail.html?id=${record.id}`;

        html += `
          <div class="col">
            <a href="${detailPageUrl}" class="text-decoration-none text-dark">
              <div class="card h-100" style="cursor:pointer;">
                ${
                  image1
                    ? `<img src="${image1}" class="card-img-top fixed-image" alt="${poi}">`
                    : ""
                }
                <div class="card-body">
                  <h5 class="card-title">${poi}</h5>
                </div>
              </div>
            </a>
          </div>
        `;

        recordIndex++;
      }

      rows[row].innerHTML = html;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

getAllRecords();
