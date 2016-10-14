
'use strict';

function getImageSource(movie: Object, kind: ?string): {uri: ?string} {
  var uri = movie && movie.posters ? movie.posters.thumbnail : null;
  if (uri && kind) {
    uri = uri.replace('tmb', kind);
  }
  //测试图片
  uri = 'http://i0.letvimg.com/lc04_iscms/201610/10/10/27/0f433a06c1d0425487be3fcdb990c015.jpg';
  return { uri };
}

module.exports = getImageSource;
