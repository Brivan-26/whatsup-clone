import {Button} from '@material-ui/core';
import {auth,provider} from '../firebase';
import Head from 'next/head';
function Loading(){
	const login =() =>  {
		auth.signInWithPopup(provider).catch(error => alert(error.message));
	}
	return <div className="loading">
		<Head>
			<title>Login</title>
		</Head>
		<div className="loadingContainer">
			<img className="loginImg" width={200} height={200} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1200px-Telegram_2019_Logo.svg.png" />
			<Button onClick={login}>Sign In with Google</Button>
		</div>
	</div>
}

export default Loading;