function parseLineCommand(lineCommand) {
    const characters = lineCommand.split('')

    const words = []
    let word = ''
    let shouldSkipSpace = true

    /*
        flow:
              - shouldSkipSpace = true
            h - add to word
              - push to word. reset word
            " - shouldSkipSpace = false, skip
            h - push to word
              - push to word
            a - push to word
            " - shouldSkipSpace = true, skip
    */

    characters.forEach(character => {
        if (shouldSkipSpace && character === ' ') {
            words.push(word)
            word = ''
        } else if (shouldSkipSpace && character === '"') {
            shouldSkipSpace = false
        } else if (shouldSkipSpace === false && character === '"') {
            shouldSkipSpace = true
        } else {
            word += character
        }
    });
    /* last word push */
    words.push(word)
    word = ''

    return words
}

export default parseLineCommand