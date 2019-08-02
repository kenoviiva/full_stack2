import React from 'react'
import PropTypes from 'prop-types'

const WriteBlogForm = ({
  handlePost,
  title, author, url,
}) => {
  return(
    <form onSubmit={handlePost}>
      <h2><span className="rainbow">Create new mind-blowing blog!</span></h2>

      <div>
        title:
        <input { ...{ type:title.type, value:title.value, onChange:title.onChange } }/>
      </div>
      <div>
        author:
        <input { ...{ type:author.type, value:author.value, onChange:author.onChange } } />
      </div>
      <div>
        url:
        <input {...{ type:url.type, value:url.value, onChange:url.onChange } } />
      </div>
      <button type="submit">create</button>
    </form>
  )}

WriteBlogForm.propTypes = {
  handlePost: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired
}

export default WriteBlogForm

