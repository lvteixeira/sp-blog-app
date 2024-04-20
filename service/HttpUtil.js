import axios from 'axios';

const get = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch(error) {
    console.error('GET request error:', error);
    throw error;
  }
};

const post = async (url, payload) => {
  try {
    const res = await axios.post(url, payload);
    return res.data;
  } catch(error) {
    console.error('POST request error:', error);
    throw error;
  }
};

const put = async (url, payload) => {
  try {
    const res = await axios.put(url, payload);
    return res.data;
  } catch(error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

const del = async (url) => {
  try {
    const res = await axios.delete(url);
    return res.data;
  } catch(error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};

const HttpUtil = {
  get,
  post,
  put,
  delete: del,
};

export default HttpUtil;