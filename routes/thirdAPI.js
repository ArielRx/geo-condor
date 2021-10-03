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

    // Authentication Headers
    // const authConfig = {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'content-type': 'multipart/form-data; boundary=--------------------------851717720672464852269708',
    //     // 'boundary': 'GEOCONDOR2021',
    //     // 'content-type': 'undefined',
    //   },
    // };

    // let request = await getMultiPartRequest();

    // console.log(request);

    // console.log(request.getHeaders());
    // let headers = request.getHeaders();
    // headers.Authorization = `Bearer ${token}`;

    // console.log(headers);
    // headers.append('Authorization', `Bearer ${token}`);

    // console.log(request.getHeaders());

    // let headers = request.getHeaders();

    // // headers.Authorization = `Bearer ${token}`

    // let response = await axios.post(
    //   process.env.SENTINEL_TRUE_COLOR_URL,
    //   request,
    //   // request.getHeaders()
    //   authConfig
    //   // headers
    // );

    var options = {
      method: 'POST',
      url: 'https://services.sentinel-hub.com/api/v1/process',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
      },
      data: '-----011000010111000001101001\r\nContent-Disposition: form-data; name="request"\r\n\r\n{\n    "input": {\n        "bounds": {\n            "properties": {\n                "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"\n            },\n            "bbox": [\n                13.822174072265625,\n                45.85080395917834,\n                14.55963134765625,\n                46.29191774991382\n            ]\n        },\n        "data": [\n            {\n                "type": "sentinel-2-l2a",\n                "dataFilter": {\n                    "timeRange": {\n                        "from": "2018-10-01T00:00:00Z",\n                        "to": "2018-12-31T00:00:00Z"\n                    }\n                }\n            }\n        ]\n    },\n    "output": {\n        "width": 512,\n        "height": 512\n    }\n}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="evalscript"\r\n\r\n//VERSION=3\n\nfunction setup() {\n  return {\n    input: ["B02", "B03", "B04"],\n    output: { bands: 3 }\n  }\n}\n\nfunction evaluatePixel(sample) {\n  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02]\n}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=""\r\n\r\n\r\n-----011000010111000001101001--\r\n'
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
      res.send(response);
    }).catch(function (error) {
      console.error(error);
    });

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
