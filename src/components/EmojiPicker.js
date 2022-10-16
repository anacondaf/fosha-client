import React from "react";
import { Picker } from "emoji-mart";
import { CarouselCaption } from "reactstrap";

function EmojiPicker(props) {
	return (
		<Picker
			set="google"
			skin={5}
			showPreview={false}
			showSkinTones={false}
			sheetSize={32}
			i18n={{
				search: "Keyword",
				categories: {
					recent: "Recently Used",
				},
			}}
			include={["people"]}
			onClick={props.userAddEmoji}
			style={{
				position: "absolute",
				top: 55,
				left: "calc(100% + 40px)",
				zIndex: 5,
				display: "none",
			}}
		/>
	);
}

export default EmojiPicker;
