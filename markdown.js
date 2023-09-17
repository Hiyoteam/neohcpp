import { Remarkable, utils } from 'remarkable'
import { linkify } from 'remarkable/linkify'
import hljs from 'highlight.js'
import remarkableKatex from 'remarkable-katex'

import { isAtBottom } from './utils'

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
  return $.imgHostWhitelist.indexOf(getDomain(link)) !== -1
}

const createRenderer = () => {
  const markdownOptions = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: '',
    linkTarget: '_blank" rel="noreferrer',
    typographer: true,
    quotes: `""''`,

    doHighlight: true,
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
    }
  }

  const md = new Remarkable('full', markdownOptions)

  md.renderer.rules.image = (tokens, idx, options) => {
    const src = utils.escapeHtml(tokens[idx].src)

    if (isWhiteListed(src) && $.allowImages) {
      const imgSrc = ' src="' + utils.escapeHtml(tokens[idx].src) + '"'
      const title = tokens[idx].title ? (' title="' + utils.escapeHtml(utils.replaceEntities(tokens[idx].title)) + '"') : ''
      const alt = ' alt="' + (tokens[idx].alt ? utils.escapeHtml(utils.replaceEntities(utils.unescapeMd(tokens[idx].alt))) : '') + '"'
      const suffix = options.xhtmlOut ? ' /' : ''
      const scrollOnload = isAtBottom() ? ' onload="window.scrollTo(0, document.body.scrollHeight)"' : ''
      return '<a href="' + src + '" target="_blank" rel="noreferrer"><img' + scrollOnload + imgSrc + alt + title + suffix + '></a>'
    }

    return '<a href="' + src + '" target="_blank" rel="noreferrer">' + utils.escapeHtml(utils.replaceEntities(src)) + '</a>'
  }

  md.renderer.rules.link_open = (tokens, idx, options) => {
    const title = tokens[idx].title ? (' title="' + utils.escapeHtml(utils.replaceEntities(tokens[idx].title)) + '"') : ''
    const target = options.linkTarget ? (' target="' + options.linkTarget + '"') : ''
    return '<a rel="noreferrer" onclick="return verifyLink(this)" href="' + utils.escapeHtml(tokens[idx].href) + '"' + title + target + '>'
  }

  md.renderer.rules.text = (tokens, idx) => {
    tokens[idx].content = utils.escapeHtml(tokens[idx].content)

    if (tokens[idx].content.indexOf('?') !== -1) {
      tokens[idx].content = tokens[idx].content.replace(/(^|\s)(\?)\S+?(?=[,.!?:)]?\s|$)/gm, (match) => {
        const channelLink = utils.escapeHtml(utils.replaceEntities(match.trim()))
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