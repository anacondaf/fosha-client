import React from "react";

//css
import "./Navbar.style.css";

//import custom component

function Navbar(props) {
	return (
		<header className="navbar">
			<div className="all-container">
				<a href="/newsfeed" class="logo">
					fosha
				</a>

				<a className="write-post-btn" href="/post/compose">
					<span>Write post</span>
				</a>
			</div>
		</header>
	);
}

export default Navbar;
