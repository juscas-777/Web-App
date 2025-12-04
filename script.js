"use strict";

const url =
  "https://api.airtable.com/v0/appd2bG7WHqaMZuiX/Table%201?maxRecords=3&view=Grid%20view";
// function for our list view
async function getAllRecords() {
  let getResultElement = document.getElementById("brews");

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patkwXt1bmB9NocbI.2b2a3d222bc5c0de05595653a9c2fede447921fd0718fb14611729909c8aa5ba`,
    },
  };

  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // response is an object w/ .records array

      getResultElement.innerHTML = ""; // clear brews

      let newHtml = "";

      for (let i = 0; i < data.records.length; i++) {
        let image = data.records[i].fields["Image"]; // here we are getting column values
        let poi = data.records[i].fields["POIs"]; //here we are using the Field ID to fecth the name property
        let description = data.records[i].fields["Description"];

        newHtml += `
        
         <div class="card" style="width: 18rem;">
          <a href="" img src="${image[0].url}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${poi}</h5>
            <p class="card-text">${description}</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
    
        
        `;
      }

      getResultElement.innerHTML = newHtml;
    });
}
