import React from "react";

//import css
import "./writepostnavbar.style.css";

import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";

export default function WritePostNavbar(props) {
	const { triggerPostProperty } = props;
	const { comboButtonState } = props;

	return (
		<div className="top-navbar">
			<div className="controll-block">
				<a href="/newsfeed" className="back-to-home">
					<Icon path={mdiArrowLeft} color="rgb(148, 148, 148" />
				</a>

				<p>Write new post</p>
			</div>

			<div className="combo-function">
				<a
					className={
						"combo-button " + (comboButtonState === 0 ? "isFocused" : " ")
					}
					onClick={triggerPostProperty}
				>
					Edit
				</a>
				<a
					className={
						"combo-button " + (comboButtonState === 1 ? "isFocused" : " ")
					}
					onClick={triggerPostProperty}
				>
					Preview
				</a>
			</div>
		</div>
	);
}
