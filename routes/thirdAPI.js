const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const FormData = require("form-data");

// @desc    Show forum page
// @route   GET /forum
router.get("/", (req, res) => {
  res.render("forum", {
    layout: "forum",
  });
});

// Set Form URL Encoded for Authentication
const params = new URLSearchParams();
params.append("grant_type", "client_credentials");
params.append("client_id", process.env.SENTINEL_CLIENT_ID);
params.append("client_secret", process.env.SENTINEL_CLIENT_SECRET);

// Form URL Headers
const config = {
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
};

// @desc Get access token
async function getAccessToken() {
  try {
    const response = await axios.post(
      process.env.SENTINEL_AUTH_URL,
      params,
      config
    );
    return response.data.access_token;
  } catch (error) {
    console.error(error);
  }
}

// @desc Get MultiPart request
async function getMultiPartRequest() {
  const formData = new FormData();
  // formData.setBoundary('GEOCONDOR2021');
  let request = {
      "input": {
          "bounds": {
              "properties": {
                  "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
              },
              "bbox": [
      -79.329572,
                  -2.802010,
      -79.314702,               
                  -2.812640            
              ]
          },
          "data": [
              {
                  "type": "sentinel-2-l2a",
                  "dataFilter": {
                      "timeRange": {
                          "from": "2021-08-24T00:00:00Z",
                          "to": "2021-08-25T00:00:00Z"
                      }
                  }
              }
          ]
      },
      "output": {
          "width": 512,
          "height": 512
      }
  };

  let evalscript = `
  //VERSION=3
  function setup() {
    return {
      input: ["B02", "B03", "B04", "B08", "B11","CLM"],
      output: { bands: 3 },
      
    };
  }
  function stretch(val, min, max) {return (val - min) / (max - min);}
  function evaluatePixel(sample) {
    var bsi = ((sample.B11 + sample.B04)-(sample.B08 + sample.B02))/((sample.B11 + sample.B04)+(sample.B08 + sample.B02));
    var NDVI = index(sample.B08, sample.B04);
    var NDWI=index(sample.B03,sample.B08);
          if (sample.CLM == 1) {
      return [sample.B04,
              sample.B03,
              3*sample.B02]
  }
    
  if (NDWI > 0.15) {
   return [0, 0.2, 1.0*NDWI]
  }
  if((sample.B11>0.8)||(NDVI<0.15)){
    return[1.5,0.7,-1]
  }  
  if (NDVI>0.25){
    return [0 , 0.2*NDVI, 0]
  }
  else {
   return [3.5*bsi, 0.3, 0]
  }
  
  }`;

  // Authentication Headers
  // const authConfig = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'content-type': 'multipart/form-data',
  //   },
  // };

  const token = await getAccessToken();

  
  let options = {
    header: {
       'Authorization': 'Bearer ' + token
   }
  };
  
    formData.append("request", JSON.stringify(request), options);
    formData.append("evalscript", (evalscript), options);
  // formData.append("Authorization", JSON.stringify(token));
  // formData.setBoundary

  return formData;
}

// @desc    True color endpoint
// @route   POST /true_color
router.post("/true_color", async (req, res) => {
  try {
    const token = await getAccessToken();

    let bbox = '[]'

    let request = {
      token,
      lat,
      lng,
      fecha:
    }
    
    let response = await axios.post(
      process.env.PHP_SENTINEL_TRUE_COLOR,
      request
    );

  } catch (error) {
    console.error(error);
  }
});

// @desc    Authenticate and get token
// @route   POST /auth_token
router.post("/auth_token", async (req, res) => {
  try {
    const response = await axios.post(process.env.SENTINEL_AUTH_URL, params, config);
    const access_token = response.data.access_token;

    res.send(access_token);
  } catch (error) {
    console.error(error);
  }
});

// @desc    Send all forum posts
// @route   GET /forum
// router.get('/get', async (req, res) => {
//   try {
//     const forum = await Forum.find();

//     res.send(forum);

//     // res.render('forum/home', {
//     //   forum,
//     // })
//   } catch (err) {
//     console.error(err)
//     res.render('error/500')
//   }
// })

module.exports = router;
