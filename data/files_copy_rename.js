/**
 *  Multiple copies of images
 *
 *  like `./[srcDir]/xx.jpg` will be processed as such:
 *
 *  ./[destDir]/xx_copy_0.jpg
 *  ./[destDir]/xx_copy_1.jpg
 *  ./[destDir]/xx_copy_2.jpg
 *  ....
 *  ./[destDir]/xx_copy_n.jpg
 */
var fs = require('fs-extra')
var path = require('path')

var srcDir = './ori';
var destDir = './dist';
var fileExt = '.jpg';
var nums = 3;  // the number of copy file amount

// filter file from dir
var ori = fs.readdirSync(srcDir).filter(function(fname) { return path.extname(fname) === fileExt });

fs.emptyDirSync(destDir);

// copy and rename file
ori.forEach(function(fname) {
  for (var index = 0; index < nums; index++) {
    var copyName = path.basename(fname, fileExt) + '_copy_' + index + fileExt;
    fs.copySync(path.join(srcDir, fname), path.join(destDir, copyName));
  }
});

