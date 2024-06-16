import React from 'react'
import loading from '../assets/Spin-1s-200px.gif'

const Loading = () => {
  return (
    <div className='text-center'>
      <img src={loading} alt={"loadingIMG"} />
    </div>
  )
}

export default Loading
