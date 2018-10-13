var rows = document.querySelector('#order-history tbody').querySelectorAll('tr')
var purchaseRows = Array.prototype.filter.call(rows, e => e.querySelector('strong').innerText.match(/Overwatch/))
var totals = purchaseRows.map(purchase => {
	const cost = parseFloat(purchase.querySelector('td:last-of-type').innerText.replace(/[^0-9.]/g, ''))
	const amount = parseInt(purchase.querySelector('td:nth-of-type(3)').innerText.match(/(\d+)( [\w ]+)? Loot Boxes$/)[1])
	return { cost, amount }
})
var total = totals.reduce((res, thing) => {
	res.cost += thing.cost
	res.amount += thing.amount
	return res
}, { cost: 0, amount: 0 })

console.log('Total spent:', `$${Math.round(total.cost)}`)
console.log('Total boxes:', total.amount)