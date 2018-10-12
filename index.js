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
            var dir = path.resolve('/', path.dirname(page.path))
            page.content = page.content.replace(linkRegex, function(match, url) {
                url = path.resolve(dir, url)
                return prefix + url
            })

            return page
        },
        'page': function(page) {
            var dir = path.resolve('/', path.dirname(page.path))
            var conf = (key) =>
                this.config.get(`pluginsConfig.${package}.` + key);


            // Head
            var repoPrefix = conf('repoPrefix')

            var {name, category, points, solves} = page
            if (name !== undefined && ( category !== undefined || solves !== undefined )) {
                var res = `
                <div class="wpHeaderContainer">
                    <h1>${name}</h1>
                    <div>
                        <span>
                            <a href="${repoPrefix + dir}"><img
                                src="${badge('', 'Attachments', 'lightgrey', 'github')}"
                                alt="Attachments"
                            /></a>
                        </span>
                `
                if (category !== undefined) { res += `
                        <span>
                            <img src="${badge(category, points, 'green')}"
                                 alt="${category} - ${points}"
                            />
                        </span>
                    `
                }
                if (solves !== undefined) { res += `
                        <span>
                            <img src="${badge('solves', solves, 'blue')}"
                                 alt="${solves} solves"
                            />
                        </span>
                    `
                }
                res += `
                    </div>
                </div>
                `

                page.content = res + page.content

            }

            return page
        }
    },
    blocks: {
        'ignore': {
            process: function(block) {
                return ''
            }
        }
    },
    filters: {
    },
}
