requirejs(['operating.system/operating.system'], (OS) => {
    const os = OS.getInstance()

    // const $boot = document.createElement('button')
    // $boot.innerHTML = 'boot'
    // $boot.onclick = () => {
    //     os.boot()
    //     $boot.remove()
    // }
    // document.body.appendChild($boot)

    os.boot()
})