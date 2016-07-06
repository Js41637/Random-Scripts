// Removes all free Steam Packages from your account
// Run on your licenses account page

var idsToRemove = [],
  done = 0,
  licenses = document.querySelectorAll('.account_table tr:not(:first-of-type'),
  modal;

function getLicenses(done) {
  console.log("Fetching licenses on page")
  let i = 0
  licenses.forEach(license => {
    i++;

    let removeLink = license.querySelector('.free_license_remove_link a[href^="javascript:RemoveFreeLicense("]')
    if (removeLink) {
      let id = removeLink.href.split(' ')[1].slice(0, -1)
      idsToRemove.push(id)
    }

    if (i == licenses.length) done()
  })
}

function removePackage(id) {
  jQuery.ajax({
    url: 'https://store.steampowered.com/account/removelicense',
    type: 'POST',
    data: {
      sessionid: g_sessionID,
      packageid: id
    }
  }).always(() => {
    done++
    modal.Dismiss()
    if (done >= idsToRemove.length) {
      ShowAlertDialog('Complete!', done + ' packages have been removed.')
    } else {
      modal = ShowBlockingWaitDialog('Removing Packages...', 'Removed ' + done + '/' + idsToRemove.length + '. Do not navigate away or refresh this page.');
    }
  })
}

setTimeout(() => {
  getLicenses(() => {
    console.log("Found", idsToRemove.length, "to remove out of", licenses.length)
    console.log("Starting to remove")
    modal = ShowBlockingWaitDialog('Removing...', 'Please wait until all requests finish.')
    let offset = 0
    idsToRemove.forEach(id => {
      setTimeout(() => {
        removePackage(id)
      }, 300 + offset)
      offset += 300
    })
  })
}, 1000)
