/**
 * Get selected resizer
 * @param {Event} ev click event
 */
export function getClickedResizer(dom, threshold, x, y) {
  /* "n" or "north" means, mouse y is below top side and above {top side + cursor threshold} */
  const n = y > dom.offsetTop
    && y < dom.offsetTop + threshold,
    e = x < dom.offsetLeft + dom.offsetWidth
      && x > dom.offsetLeft + dom.offsetWidth - threshold,
    s = y < dom.offsetTop + dom.offsetHeight
      && y > dom.offsetTop + dom.offsetHeight - threshold,
    w = x > dom.offsetLeft
      && x < dom.offsetLeft + threshold

  return s && e ? 'se'
    : s && w ? 'sw'
      : n && e ? 'ne'
        : n && w ? 'nw'
          : n ? 'n'
            : e ? 'e'
              : s ? 's'
                : w ? 'w'
                  : ''
}
