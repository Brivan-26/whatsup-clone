import {Avatar, IconButton, Button } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ChatList from './ChatList.jsx';
import {auth} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import db from '../firebase';
import * as EmailValidator from 'email-validator';
import DehazeIcon from '@material-ui/icons/Dehaze';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import CloseIcon from '@material-ui/icons/Close';
import PeopleIcon from '@material-ui/icons/People';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import PersonIcon from '@material-ui/icons/Person';
import CallIcon from '@material-ui/icons/Call';
import SettingsIcon from '@material-ui/icons/Settings';
import {useState} from 'react';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Modal from './Modal.jsx';


function SideBar({darkMode, setDarkMode}){
	const [user] = useAuthState(auth);
	const [isModalOpen, setIsModalOpen] = useState(false);
	// get the chats where the authenticated user included
	const userChatRef = db.collection('chats').where('users','array-contains',user.email);
	// transferm chatRef to real time
	const [chatsSnapshot] = useCollection(userChatRef);
	const usersRef = db.collection('user')
	const [usersSnapshot] = useCollection(usersRef);


	const newChat = () => {
		const input = prompt("Please Enter the recipient's Email adress");
		if(!input) return;
		if(EmailValidator.validate(input) && fakeEmail(input)>0 && !chatAlreadyExist(input) && input !== user.email ) {
			db.collection("chats").add({
				users :[user.email,input],
			});
		}else {
			setIsModalOpen(true)
			
		}
	}

	const chatAlreadyExist = (recipientEmail) => {
		return !!chatsSnapshot?.docs.find((chat) => chat.data()
				.users.find((user)=> user === recipientEmail)?.length > 0);
	}
	const fakeEmail = (input) => {
		let i = 0
		usersSnapshot?.docs
		.find((user) => user.data().email === input ? i++ :"")
		return i;
	}

	const [sidebarToggle, setSidebarToggle] = useState(false);
	const switchMode = (currentMode) => {
		if(currentMode == "light") {
			setDarkMode("dark")
		}else {
			setDarkMode("light")
		}
	}
	return <div className="sidebar">
	{isModalOpen && <Modal setIsModalOpen={setIsModalOpen}/>}
		{sidebarToggle ? (<div className="sidebar__toggle">
					<div className={darkMode == "light" ? "sidebar__toggle__header" : "sidebar__toggle__headerDark"}>
				<div className="sidebar__toggle__header__top">
					<Avatar src={user.photoURL}  className="avatar"/>
					<div>
						<IconButton>
							<AnnouncementIcon className="toggle__avatar"/>
						</IconButton>
						<IconButton>
							<CloseIcon onClick={()=> setSidebarToggle(false)} className="toggle__avatar"/>
						</IconButton>
					</div>
				</div>
				<div className="sidebar__toggle__header__bottom">
					<h3>Mohamed Abdessamed Rezazi</h3>
					<p>+213 674771817</p>
				</div>
					</div>

			<div className={darkMode == "light" ? "sidebar__toggle__items" : "sidebar__toggle__itemsDark"}>
				<div className={darkMode == "light" ? "sidebar__toggle__items__option" : "sidebar__toggle__items__optionDark"}>
					<PeopleIcon className="gray"/>
					<p className={darkMode == "dark" ? "whiteDark" : ""}>New Group</p>
				</div>
				<div className={darkMode == "light" ? "sidebar__toggle__items__option" : "sidebar__toggle__items__optionDark"}>
					<AddAlertIcon className="gray"/>
					<p className={darkMode == "dark" ? "whiteDark" : ""}>New Channel</p>
				</div>
				<div className={darkMode == "light" ? "sidebar__toggle__items__option" : "sidebar__toggle__items__optionDark"}>
					<PersonIcon className="gray"/>
					<p className={darkMode == "dark" ? "whiteDark" : ""}>Contacts</p>
				</div>
				<div className={darkMode == "light" ? "sidebar__toggle__items__option" : "sidebar__toggle__items__optionDark"}>
					<CallIcon className="gray"/>
					<p className={darkMode == "dark" ? "whiteDark" : ""}>Calls</p>
				</div>
				<div className={darkMode == "light" ? "sidebar__toggle__items__option" : "sidebar__toggle__items__optionDark"}>
					<SettingsIcon className="gray"/>
					<p className={darkMode == "dark" ? "whiteDark" : ""}>Settings</p>
				</div>
				<div onClick={()=> switchMode(darkMode)} className={darkMode == "light" ? "sidebar__toggle__items__option" : "sidebar__toggle__items__optionDark"}>
					<Brightness3Icon className="gray"/>
					<p className={darkMode == "dark" ? "whiteDark" : ""}>Dark Mode({darkMode})</p>
				</div>
				<div onClick={()=> auth.signOut()} className={darkMode == "light" ? "sidebar__toggle__items__option" : "sidebar__toggle__items__optionDark"}>
					<ExitToAppIcon className="gray"/>
					<p className={darkMode == "dark" ? "whiteDark" : ""}>Log out</p>
				</div>
			</div>

			<div className={darkMode == "light" ? "sidebar__toggle__footer" : "sidebar__toggle__footerDark"}>
				<h3 className={darkMode == "dark" ? "whiteDark" : ""}>Telegram Web</h3>
				<p className={darkMode == "dark" ? "whiteDark" : ""}>Version 1</p>
			</div>
		</div>
			)
			:(<div className="sidebar__noToggle">
					<div className={"sidebar__header " + (darkMode == "dark" ? "darkBg borderDark" : "")}>
						<IconButton>
							<DehazeIcon className={darkMode == "dark" ? "whiteDark" : ""} onClick={() => setSidebarToggle(true)} />
						</IconButton>
						<div className="search__header">
							<form>
								<input className={darkMode == "dark" ? "whitesmokeDark" : ""} type="text" placeholder="search"/>
								<button type="submit" hidden >Search</button>
							</form>
						</div>
					</div>

				<div className={darkMode == "dark" ? "sidebar__newChatDark" : "sidebar__newChat"}>
					<Button onClick={newChat} className="btn ">Start a new chat!</Button>
				</div>

				<div className={"sidebar__chatList " + (darkMode=="dark" ? "darkBg" : "")}>
					{chatsSnapshot?.docs.map((chat) => {
						return <ChatList darkMode={darkMode} key={chat.id} id={chat.id} users={chat.data().users} />
					})}
				</div>
			</div>
			)
		}
		
		
	</div>
}

export default SideBar;

