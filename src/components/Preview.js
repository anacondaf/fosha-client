import React, { useState, useEffect } from "react";

//import css
import "./preview.style.css";

import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import ReactMarkDown from "react-markdown";

//custom component
import WritePostNavbar from "./WritePostNavbar";

function Preview(props) {
	//load post.content in localStorage and add to state
	let [postContent, setPostContent] = useState("");

	useEffect(() => {
		let content = JSON.parse(localStorage.getItem("post-content")).content;
		setPostContent(content);
	});

	//destructuring props
	const { triggerPostProperty, comboButtonState } = props;

	return (
		<div className="preview-window">
			<WritePostNavbar
				triggerPostProperty={triggerPostProperty}
				comboButtonState={comboButtonState}
			/>

			<div className="preview-content">
				{postContent ? (
					<ReactMarkDown children={postContent} />
				) : (
					<p className="blank-page">
						<i>
							You will see your post content when you type something in edit
							window
						</i>
					</p>
				)}
			</div>
		</div>
	);
}

export default Preview;
