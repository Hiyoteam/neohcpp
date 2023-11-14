import { Remarkable, utils } from "remarkable"
const { has, unescapeMd, replaceEntities, escapeHtml } = utils
import { linkify } from "remarkable/linkify"
import hljs from "highlight.js"
import remarkableKatex from "remarkable-katex"

import "katex/dist/katex.css"

/**
 * @param {string} link
 * @returns {string}
 */
const getDomain = (link) => (
  new URL(link).hostname
)

/**
 * @param {string} link
 * @returns {boolean}
 */
const isWhiteListed = (link) => {
  return imgHostWhitelist.includes(getDomain(link))
}

/**
 * @param {Partial<Remarkable.Options>} options
 */
const createRenderer = (options) => {
  const markdownOptions = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: 'hljs language-',
    linkTarget: '_blank" rel="noreferrer',
    typographer: true,
    quotes: `""''`,

    doHighlight: true,

    /**
     * @param {string} str
     * @param {string} lang
     */
    highlight(str, lang) {
      if (!this.doHighlight) {
        return ''
      }

      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (_) { }
      }

      try {
        return hljs.highlightAuto(str).value
      } catch (_) { }

      return ''
    },

    ...options
  }

  const md = new Remarkable('full', markdownOptions)

  md.renderer.rules.fence = function (tokens, idx, options, env, instance) {
    var token = tokens[idx]
    var langClass = ' class="hljs"'
    var langPrefix = options.langPrefix
    var langName = '', fences, fenceName
    var highlighted

    if (token.params) {
      fences = token.params.split(/\s+/g)
      fenceName = fences.join(' ')

      if (has(instance.rules.fence_custom, fences[0])) {
        return instance.rules.fence_custom[fences[0]](tokens, idx, options, env, instance)
      }

      langName = escapeHtml(replaceEntities(unescapeMd(fenceName)))
      langClass = ' class="' + langPrefix + langName + '"'
    }

    if (options.highlight) {
      highlighted = options.highlight.apply(options.highlight, [token.content].concat(fences))
        || escapeHtml(token.content)
    } else {
      highlighted = escapeHtml(token.content)
    }

    return '<pre><code' + langClass + '>'
      + highlighted
      + '</code></pre>'
      + md.renderer.getBreak(tokens, idx)
  }

  md.renderer.rules.image = (tokens, idx, options) => {
    const src = escapeHtml(tokens[idx].src)

    if (isWhiteListed(src) && allowImages) {
      const imgSrc = ' src="' + escapeHtml(tokens[idx].src) + '"'
      const title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : ''
      const alt = ' alt="' + (tokens[idx].alt ? escapeHtml(replaceEntities(unescapeMd(tokens[idx].alt))) : '') + '"'
      const suffix = options.xhtmlOut ? ' /' : ''
      const scrollOnload = isAtBottom() ? ' onload="window.scrollTo(0, document.body.scrollHeight)"' : ''
      return '<a href="' + src + '" target="_blank" rel="noreferrer"><img' + scrollOnload + imgSrc + alt + title + suffix + '></a>'
    }

    return '<a href="' + src + '" target="_blank" rel="noreferrer">' + escapeHtml(replaceEntities(src)) + '</a>'
  }

  md.renderer.rules.link_open = (tokens, idx, options) => {
    const title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : ''
    const target = options.linkTarget ? (' target="' + options.linkTarget + '"') : ''
    return '<a rel="noreferrer" onclick="return verifyLink(this)" href="' + escapeHtml(tokens[idx].href) + '"' + title + target + '>'
  }

  md.renderer.rules.text = (tokens, idx) => {
    tokens[idx].content = escapeHtml(tokens[idx].content)

    if (tokens[idx].content.indexOf('?') !== -1) {
      tokens[idx].content = tokens[idx].content.replace(/(^|\s)(\?)\S+?(?=[,.!?:)]?\s|$)/gm, (match) => {
        const channelLink = escapeHtml(replaceEntities(match.trim()))
        const whiteSpace = (match[0] === '?') ? '' : match[0]
        return whiteSpace + '<a href="' + channelLink + '" target="_blank">' + channelLink + '</a>'
      })
    }

    return tokens[idx].content
  }

  md.use(remarkableKatex)

  md.use(linkify)

  return md
}

export { createRenderer }
