var path = require('path');
var linkRegex = /(?<=\[[^\]]*\]\()\[(.*)\](?=\))/g;

var package = 'writeup-utils'

function badge(tag, value, color, logo) {
    url = `https://img.shields.io/badge/`
    url += `${tag}-${value}-${color}.svg`
    url += `?style=for-the-badge&maxAge=3600`
    if (logo !== undefined) {
        url += `&logo=${logo}`
    }
    return url
}

var dir;

module.exports = {
    book: {
        assets: './assets',
        css: [
            'plugin.css'
        ]
    },
    hooks: {
        'page:before': function(page) {
            var conf = (key) =>
                this.config.get(`pluginsConfig.${package}.` + key);

            // Resolve source code links
            var prefix = conf('filePrefix')
            dir = path.resolve('/', path.dirname(page.path))
            page.content = page.content.replace(linkRegex, function(match, url) {
                url = path.resolve(dir, url)
                return prefix + url
            })


            return page
        }
    },
    blocks: {
        'ignore': {
            process: function(block) {
                return ''
            }
        },
        'writeupHeader': {
            blocks: ['name', 'links', 'level', 'category', 'points', 'solves'],
            process: function(block) {
                var conf = (key) =>
                    this.config.get(`pluginsConfig.${package}.` + key);

                var blocks = {}
                for (let blk of block.blocks) {
                    blocks[blk.name] = blk.body.trim()
                }

                var repoPrefix = conf('repoPrefix')

                var res = `
                <div class="wpHeaderContainer">
                    <h1>${blocks.name}</h1>
                        <span>
                            <a href="${repoPrefix + dir}"><img
                                src="${badge('', 'Attachments', 'lightgrey', 'github')}"
                                alt="Attachments"
                            /></a>
                        </span>
                        <span>
                            <img src="${badge(blocks.category, blocks.points, 'green')}"
                                 alt="${blocks.category} - ${blocks.points}"
                            />
                        </span>
                        <span>
                            <img src="${badge('solves', blocks.solves, 'blue')}"
                                 alt="${blocks.solves} solves"
                            />
                        </span>
                </div>
                `
                return res
            }
        }
    },
    filters: { },
}
