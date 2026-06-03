const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
  try {
    const formData = new FormData();
    formData.append("word", "test");
    formData.append("translation", "test");
    formData.append("language", "French");

    // We don't have token but we can see if it returns 401 or hangs
    const res = await axios.post("http://localhost:5000/api/vocabulary", formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    console.log(res.status, res.data);
  } catch (err) {
    console.log("ERROR:", err.response ? err.response.status + " " + JSON.stringify(err.response.data) : err.message);
  }
}
test();
