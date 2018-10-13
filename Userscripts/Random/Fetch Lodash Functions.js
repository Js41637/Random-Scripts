//Fetches all lodash functions and stores the
// name, command, description and when it was added in an object

var methods = document.querySelectorAll('.doc-container > div > div')
var lodashFunctions = {}

methods.forEach(method => {
  let name = method.querySelector('h3').getAttribute('id')
  let id = name.toLowerCase()
  let command = method.querySelector('h3 code').innerText
  let since = method.querySelector('h4:nth-of-type(1)')
  
  let description = method.querySelector('p:nth-of-type(2)')
  description = description ? description.innerHTML.split('\n\n\n').slice(0, 1).toString().replace(/(\n)+/g, ' ') : {}
  const parser = new DOMParser()
  const { body } = parser.parseFromString(description.replace(/(<code>|<\/code>)/g, '`'), 'text/html')
  description = (body.innerText || '').trim().replace(/\n+/g, ' ')

  
  since = since ? since.nextElementSibling.innerText : 'Unknown'
  id = name == 'lodash' ? '_' : id

  lodashFunctions[id] = {
    name,
    command,
    description,
    since
  }
})

// Extra one to hide _ or template as they are super long
for (var l in lodashFunctions) {
  if (l == '_') {
    lodashFunctions[l] = {
      name: l,
      dontShow: true
    }
  }
}

console.log(lodashFunctions)