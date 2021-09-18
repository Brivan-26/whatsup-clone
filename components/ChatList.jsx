import {Avatar} from '@material-ui/core';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import {auth} from '../firebase';
import db from '../firebase';
import {useRouter} from 'next/router';
function ChatList({id ,users, darkMode}){
	const [user] = useAuthState(auth);
	const recipientUserEmail = users.filter((userFilter) => userFilter !== user.email)[0];
	const [recipientSnapshot] = useCollection(db.collection("user").
		where("email","==",recipientUserEmail));
	const router = useRouter();
	const recpient = recipientSnapshot?.docs?.[0]?.data();
	const enterChat = () => {
		router.push(`/chat/${id}`);
	}
	return <div className="chatList" onClick={enterChat}>
		{recpient ? 
			<Avatar src={recpient.photoUrl} />
			:
			<Avatar>{recipientUserEmail[0]}</Avatar>
			 }
		<p className={darkMode == "dark" ? "whiteDark" : ""}>{recipientUserEmail}</p>
	</div>
}

export default ChatList;