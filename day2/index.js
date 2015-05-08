var fs = require('fs');
var path = require('path');

var root = '/Users/zhulei/Documents/demo/';
var info = [];

function readJson(dir) {
    fs.readdir(dir, function (err, files) {
        if (err) {
            throw err;
        }
        else {
            files.forEach(function (file) {
                var filePath = path.join(dir, file);

                if (/node_module/.test(filePath)) {
                    return;
                }
                
                var stats = fs.statSync(filePath);
                console.log(1);
                if (stats.isDirectory()) {
                    readJson(filePath);
                }
                else {
                    if (path.extname(filePath) == '.json') {
                        info.push({
                            name: file,
                            path: filePath
                        });
                    }
                }
            });
            var str = '';
            info.forEach(function (p) {
                str += p.name + '\n' + p.path + '\n\n';
            });
            fs.writeFile('info.txt', str);
        }
    });
}

readJson(root);
