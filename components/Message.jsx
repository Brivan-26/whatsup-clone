import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../firebase';
import moment from 'moment';
function Message({user,message, darkMode}) {
	const [userLoggedIn] = useAuthState(auth);
	return (
		<div  className="message__container">
			<p className={darkMode == "light" ?("msg " + (message.user === userLoggedIn.email ? 'sender' : 'receiver')) : ("msgDark " + (message.user === userLoggedIn.email ? 'senderDark' : 'receiverDark'))}>
				{message.message}
				<span classNam={darkMode == "light" ? "timestamp" : "timestampDark"}>{message.timestamp? moment(message.timestamp).format("LT"): "Uknown"}</span>
			</p>

	</div>
	)
}

export default Message;