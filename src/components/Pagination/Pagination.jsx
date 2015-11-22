import React, { Component, PropTypes as T } from 'react'

const calcRange = (page, limit) => {
  const from = Math.floor(page / limit) * limit + 1
  const to = from - 1 + limit
  return {
    from, to
  }
}
const rangeMap = (from, to, step, iterator) => {
  const result = []
  for (let i = from; i <= to; i = i + step) {
    result.push(iterator.call(null, i))
  }
  return result
}

class Pagination extends Component {

  static propTypes = {
    pageCount: T.number.isRequired,
    currentPage: T.number,
    pageLimit: T.number,
    activeClass: T.string,
    mapLink: T.func
  }

  static defaultProps = {
    currentPage: 1,
    pageLimit: 10,
    activeClass: "active",
    mapLink: () => {}
  }

  render () {
    const { pageCount, currentPage, pageLimit, activeClass, mapLink } = this.props
    let { from, to } = calcRange(currentPage, pageLimit)
    if (from < 1) from = 1
    if (to > pageCount) to = pageCount
    return (
      <ul className="pagination">
        <li>
          <a href="#">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {rangeMap(from, to, 1, (i) => <li key={i}>{mapLink(i)}</li>)}
        <li>
          <a href="#">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    )
  }
}

export default Pagination
