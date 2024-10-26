import './DisplayWindow.css'

const DisplayWindow = (props) => {
    
    return (
        <>
            {   
                props.isVisible &&
                <div className="display-window-box">
                    <div>
                        <div className="title-bar">
                            <span>{props.title}</span>
                            <span>
                                <div className='close-display-window' onClick={props.onClose}>x</div>
                            </span>
                        </div>
                    </div>
                    <div>{props.children}</div>
                </div>
            }
        </>
    )
}

export default DisplayWindow