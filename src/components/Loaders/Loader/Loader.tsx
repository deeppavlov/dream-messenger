import { FC } from 'react'
import { RotatingLines } from 'react-loader-spinner'

const Loader: FC = () => {
  return (
    <RotatingLines
      strokeColor='grey'
      strokeWidth='5'
      animationDuration='0.75'
      width='48'
      visible={true}
    />
  )
}

export default Loader
