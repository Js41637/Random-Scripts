// Fetches all ramda functions and stores the
// name, command, description, example, versison added and other stuff.

var methods = document.querySelectorAll('.section-id')
var ramdaFunctions = {}

methods.forEach(method => {
  const name = method.id
  const id = name.toLowerCase()

  const methodData = method.nextElementSibling
  const command = (methodData.querySelector('div:first-of-type > code') || {}).innerText || name
  const category = methodData.querySelector('.label-category').innerText || 'Unknown'
  const since = ((methodData.querySelector('p:first-of-type small') || {}).innerText || '').split(' ')[2] || 'Unknown'
  const see = Array.prototype.map.call(methodData.querySelectorAll('.see a'), el => el.innerText)
  const example = methodData.querySelector('.hljs.javascript').innerText || null

  // Replace all <code> </code> elements with ` so Slack knows they're code blocks
  //  grabs the innerHTML, replaces all code elements, converts back to HTML then gets the innerText
  var description = ((methodData.querySelector('div.description') || {}).innerHTML || '')
  const parser = new DOMParser()
  const { body } = parser.parseFromString(description.replace(/(<code>|<\/code>)/g, '`'), 'text/html')
  description = (body.innerText || '').trim().replace(/\n+/g, ' ')

  ramdaFunctions[id] = { name, command, category, since, description, see, example }
})
