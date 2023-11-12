const expandSidebar = () => {
  $id('sidebar-content').classList.remove('hidden')
  sidebar.classList.add('expand')
}

const closeSidebar = () => {
  $id('sidebar-content').classList.add('hidden')
  sidebar.classList.remove('expand')
}

sidebar.addEventListener('mouseenter', (e) => {
  if (e.target === $id('sidebar-close')) {
    return
  }
  expandSidebar()
  e.stopPropagation()
})

sidebar.addEventListener('click', (e) => {
  if (e.target === $id('sidebar-close')) {
    return
  }
  expandSidebar()
  e.stopPropagation()
})

sidebar.addEventListener('mouseleave', () => {
  closeSidebar()
})

document.addEventListener('click', (e) => {
  let el = e.toElement || e.relatedTarget
  try {
    if (el.parentNode == document || el == document) {
      return
    }
  } catch (e) { return }

  closeSidebar()
})

$id('sidebar-close').addEventListener('click', () => {
  closeSidebar()
})
