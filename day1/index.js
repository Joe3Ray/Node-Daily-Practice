var fs = require('fs');
var superagent = require('superagent');
var cheerio = require('cheerio');

var articles = [];

function getArticle(index) {
    var url = 'http://fex.baidu.com/articles/';
    if (index > 1) {
        url += 'page' + index + '/';
    }
    superagent.get(url).end(function (err, res) {
        if (err) {
            throw err;
        }
        else {
            var $ = cheerio.load(res.text);
            $('.post-list li a').each(function (i, ele) {
                var $ele = $(ele);
                var obj = {
                    url: $ele.attr('href'),
                    title: $ele.children('p').text(),
                    publish: $ele.children('span').text()
                };
                articles.push(obj);
            });
            var nextPageUrl = $('.pagination .next').attr('href');
            if (nextPageUrl != '#') {
                getArticle(++index);
            }
            else {
                var str = '';
                articles.forEach(function (article) {
                    str += '##[' + article.title + ']';
                    str += '(http://fex.baidu.com' + article.url + ')';
                    str += '\n';
                    str += article.publish;
                    str += '\n\n';
                });
                fs.writeFile('article.md', str);
            }
        }
    });
}

getArticle(1);
