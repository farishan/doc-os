function renderBootButton(os) {
    const $boot = document.createElement('button')
    $boot.innerHTML = 'boot'
    $boot.onclick = () => {
        os.execute('boot')
        $boot.remove()
    }
    document.body.appendChild($boot)
}

export {
    renderBootButton
}