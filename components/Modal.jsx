import CloseIcon from '@material-ui/icons/Close';
function Modal ({setIsModalOpen}){
	return <div className={"modal"}>
		<div className="modal__header">
			<h3>Ooops!</h3>
			<CloseIcon onClick={()=> setIsModalOpen(false)} className="redColor"/>
		</div>
		<div className="modal__content">
			<p>Please make sure that you enter a registred user's email</p>
		</div>
	</div>
}

export default Modal;