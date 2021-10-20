import React,{useState} from 'react'

export default function Modal(props) {

  const [open,setOpen]=useState(false)

  useEffect(() => {

  }, [props])

  return (
    <div className="popup" style={{display: open==true ? 'block' : 'none'}}>
      <div className="modal">
        <button> <i className="fa fa-times" ></i> </button>
        <img src={props.image} />
      </div>
    </div>
  )
}
