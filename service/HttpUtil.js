import axios from 'axios';

const post = async(url, payload) => {
  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch(error) {
    throw error;
  }
};

const HttpUtil = {
  post,
};

export default HttpUtil;