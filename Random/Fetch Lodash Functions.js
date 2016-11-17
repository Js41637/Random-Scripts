//Fetches all lodash functions and stores the
// name, command, description and when it was added in an object

var methods = document.querySelectorAll('.doc-container > div > div')
var lodashFunctions = {}

methods.forEach(method => {
  let name = method.querySelector('h3').getAttribute('id')
  let command = method.querySelector('h3 code').innerText
  let description = method.querySelector('p:nth-of-type(2)').innerText.split('\n\n\n').slice(0, 1).toString().replace(/(\n)+/g, ' ')
  let since = method.querySelector('h4:nth-of-type(1)')
  since = since ? since.nextElementSibling.innerText : 'Unknown'

  lodashFunctions[name.toLowerCase()] = {
    name,
    command,
    description,
    since
  }
})

// Extra one to hide _ or template as they are super long
for (var l in lodashFunctions) {
  if (l == '_' || l == 'template') lodashFunctions[l] = {
    name: l,
    dontShow: true
  }
}
