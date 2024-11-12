const lodash = require('lodash');

const getInfoDatas = ({fields = [], data}) => {
  return lodash.pick(data, fields);
}

module.exports = {
  getInfoDatas
}