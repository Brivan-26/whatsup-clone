import {Avatar, IconButton} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SideBar from '../../components/SideBar.jsx';
import Head from 'next/head';
import db from '../../firebase';
import {auth} from '../../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import MicIcon from '@material-ui/icons/Mic';
import {useRouter} from 'next/router';
import firebase from 'firebase';
import Message from '../../components/Message.jsx';
import {useState, useRef} from 'react';
import TimeAgo from 'timeago-react'
function Chat({chat,messages}) {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const recipientUserEmail = chat.users.filter((userFilter) => userFilter !== user.email)[0];
	const [recipientSnapshot] = useCollection(db.collection("user")
		.where("email","==", recipientUserEmail));
	const recpient = recipientSnapshot?.docs.[0]?.data();
	const [input, setInput] = useState("");
	const bottomChat = useRef(null)
 
	const SendMessage = (e) => {
		e.preventDefault();
		if (!input) return;
		db.collection("user").doc(user.id).set({
			lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
		},{merge:true});
		db.collection("chats").doc(router.query.id).collection("messages").add({
			timestamp:firebase.firestore.FieldValue.serverTimestamp(),
			user: user.email,
			message: input,
			photoURL: user.photoURL,
		});
		setInput("");
		bottomChat.current.scrollIntoView({
			behavior:"smooth",
			block:"start",
		});
	}

	const [messagesSnapshot] = useCollection(db.collection("chats")
								.doc(router.query.id)
								.collection("messages")
								.orderBy("timestamp","asc")
	);

	
	const showMessages = () => {
		if(messagesSnapshot) {
			return messagesSnapshot.docs.map((message) => {
				return <Message
							darkMode = {darkMode} 
							key={message.id}
							user= {message.user}
							message = {{
								...message.data(),
								timestamp:message.data().timestamp?.toDate().getTime(),
							}}
						/>
			})
		}else {
			return JSON.parse(messages).map((message) => {
				return <Message
							darkMode = {darkMode} 
							key={message.id}
							user= {message.user}
							message = {messages}
						/>
			})
		}
	}

	const [darkMode, setDarkMode] = useState("light")
	console.log(recpient)
	return <div className="container">
		<Head>
			<title>Chat with: {recipientUserEmail}</title>
		</Head>
		<div className="chat">
			<div className={darkMode == "light" ? "chat__header" : "chat__headerDark"}>
				<div className="chat__header__left">
					{recpient ? 
					<Avatar src={recpient.photoUrl} />
					:
					<Avatar>{recipientUserEmail[0]}</Avatar>
					 }
					<div className="header__chatInfo">
						<h2 className={darkMode == "dark" ? "whiteDark" : "grayLight"}>{recipientUserEmail}</h2>
						{recipientSnapshot ? (<p>
							Last seen : {recpient?.lastSeen?.toDate() ? (
									<TimeAgo datetime={recpient?.lastSeen?.toDate()} />
								) : "Unkown"}
						</p>) : <p>Loading...</p>}
					</div>
				</div>
				<div className="chat__header__right">
					<IconButton>
						<AttachFileIcon className="avatar"/>
					</IconButton>

					<IconButton>
						<MoreVertIcon className="avatar"/>
					</IconButton>
				</div>
			</div>

			<div className={darkMode == "light" ? "chat__messages" : "chat__messagesDark"}>
				{showMessages()}
				<div className="bottomChat" ref={bottomChat}></div>
				
			</div>

			<div className={darkMode == "light" ? "chat__input" : "chat__input chat__inputDark"}>
				<EmojiEmotionsIcon className="avatar"/>
				<form>
					<input className={darkMode == "dark" ? "chat__inputDark" : ""} value={input}
							onChange={(e) => setInput(e.target.value)}
							type="text"
							placeholder="Enter a message"
					/>
					<button hidden onClick={SendMessage} type="submit">Send Message</button>
				</form>
				<MicIcon className="avatar"/>
			</div>
		</div>
		<SideBar darkMode={darkMode} setDarkMode={setDarkMode}/>
	</div>
}

export default Chat;

export async function getServerSideProps(context) {
	const ref = db.collection("chats").doc(context.query.id);
	// PREPARE MESSAGES
	const messagesRes = await ref
		.collection("messages")
		.orderBy("timestamp","asc")
		.get();
	const messages = messagesRes.docs.map((doc) => ({
		id:doc.id,
		...doc.data(),
	}))
	.map((messages) => ({
		...messages,
		timestamp:messages.timestamp.toDate().getTime(),
	}));

	//PREPARE THE CHAT
	const chatRes = await ref.get();
	const chat = {
		id:chatRes.id,
		...chatRes.data()
	}
	return {
		props:{
			messages:JSON.stringify(messages),
			chat:chat
		},
	};
}