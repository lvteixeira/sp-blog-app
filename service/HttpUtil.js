import axios from 'axios';

const get = async(url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch(error) {
    console.log(error)
    throw error;
  }
}

const post = async(url, payload) => {
  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch(error) {
    throw error;
  }
};

const HttpUtil = {
  get,
  post,
};

export default HttpUtil;