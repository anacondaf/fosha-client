import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import autosize from "autosize";

//URL
import { API_URL } from "../config/url";

//css
import "./Writepost.style.css";

import Icon from "@mdi/react";
import { mdiFileImageOutline } from "@mdi/js";
import Loader from "react-loader-spinner";

//custom component
import EmojiPicker from "../components/EmojiPicker";
import Preview from "../components/Preview";
import WritePostNavbar from "../components/WritePostNavbar";

function WritePost(props) {
	//cover image state
	let [coverUrl, setCoverUrl] = useState("");

	//upload spinner state
	let [loading, setLoading] = useState(0);
	//content upload image loading
	let [contentImageLoading, setContentImageLoading] = useState(0);
	let [contentImageMarkdown, setContentImageMarkdown] = useState("");

	//upload failed
	let [uploadFailed, setUploadFailed] = useState(false);

	//user put content
	let [postContent, setPostContent] = useState({
		caption: "",
		mainbackground: "",
		category: "Food",
		content: "",
		tagsList: [],
		cloudinary_public_id: "",
	});

	let [tags, setTags] = useState("");

	//redirect to /newsfeed
	let [redirect, setRedirect] = useState(null);

	//caption-field and content-field height
	let [captionHeight, setCaptionHeight] = useState(68);
	let [contentHeight, setContentHeight] = useState(240);

	//Post property window
	let [postProperty, setPostProperty] = useState("edit");
	let [comboButtonState, setComboButtonState] = useState(0);

	//get the current cursor position in content-textfield
	let [cursorPos, setCursorPos] = useState(0);

	//useRef
	let popup = useRef();
	let captionTextField = useRef();
	let contentTextField = useRef();

	useEffect(() => {
		if (JSON.parse(localStorage.getItem("post-content")) === null) {
			localStorage.setItem("post-content", JSON.stringify(postContent));
		} else {
			let postFromStorage = JSON.parse(localStorage.getItem("post-content"));
			setPostContent(postFromStorage);
			postFromStorage.mainbackground ? setLoading(2) : setLoading(0);
			setCoverUrl(postFromStorage.mainbackground);
		}

		if (JSON.parse(localStorage.getItem("textarea-height")) === null) {
			localStorage.setItem(
				"textarea-height",
				JSON.stringify({
					captionHeight,
					contentHeight,
				})
			);
		} else {
			let textareaHeight = JSON.parse(localStorage.getItem("textarea-height"));
			setCaptionHeight(textareaHeight.captionHeight);
			setContentHeight(textareaHeight.contentHeight);
		}

		autosize(contentTextField.current);
		autosize(captionTextField.current);
	}, []);

	//prevent tags input enter for new line
	const preventNewLine = (e) => {
		return (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
			}
		};
	};

	const onKeyUp = (e) => {
		if (e.keyCode === 188) {
			setTags(tags + "  ");
		}
	};

	//value change for tags input
	const changeTags = (e) => {
		setTags(e.target.value);
	};

	const dropOption = (e) => {
		let options = document.querySelector(".options");
		options.classList.toggle("drop");
	};

	const userChooseOption = (e) => {
		let option = e.target;
		let options = document.querySelector(".select-button");
		options.children[0].innerHTML = option.innerHTML;

		//add category to localStorage
		let {
			caption,
			mainbackground,
			content,
			tagsList,
			cloudinary_public_id,
		} = postContent;

		setPostContent(
			(postContent = {
				caption: caption,
				mainbackground: mainbackground,
				category: option.innerHTML,
				content: content,
				tagsList: tagsList,
				cloudinary_public_id: cloudinary_public_id,
			})
		);
		localStorage.setItem("post-content", JSON.stringify(postContent));
		dropOption(e);
	};

	const contentImageAutoCopy = (e) => {
		let copyContentImage = document.querySelector(".markdown-image-syntax");
		copyContentImage.select();
		document.execCommand("copy");

		popup.current.classList.add("animation");

		setTimeout(() => {
			popup.current.classList.remove("animation");
		}, 1000);
	};

	const OPTIONS = [
		{ id: 0, name: "Trang mieng" },
		{ id: 1, name: "Food" },
		{ id: 2, name: "Trai cay" },
		{ id: 3, name: "Banh" },
		{ id: 4, name: "Cocktail" },
		{ id: 5, name: "Detox" },
		{ id: 6, name: "Sinh to" },
	];

	//mainbackground image for CAPTION
	let captionMainBackground;

	//user upload image for CAPTION
	let sendImage = async (e) => {
		let files = e.target.files;
		let data = new FormData();
		data.append("file", files[0]);
		data.append("upload_preset", "bdyzskvu");

		setLoading(1);

		const response = await fetch(
			"https://api.cloudinary.com/v1_1/djbkxkx8m/image/upload",
			{
				method: "POST",
				body: data,
			}
		);

		const file = await response.json();
		setCoverUrl(file.secure_url);

		let { caption, category, content, tagsList } = postContent;

		setPostContent(
			(postContent = {
				caption: caption,
				mainbackground: file.secure_url,
				category: category,
				content: content,
				tagsList: tagsList,
				cloudinary_public_id: file.public_id,
			})
		);

		localStorage.setItem("post-content", JSON.stringify(postContent));

		setLoading(2);
	};

	//change and remove button events
	const changeCaptionMainBackground = (e) => {
		removeCaptionMainbackground(e);
		sendImage(e);
	};

	//event for remove caption image
	const removeCaptionMainbackground = (e) => {
		axios.delete(API_URL + "/deleteImage", {
			data: {
				public_id: postContent.cloudinary_public_id,
			},
		});

		let { caption, category, content, tagsList } = postContent;

		setPostContent(
			(postContent = {
				caption: caption,
				mainbackground: "",
				category: category,
				content: content,
				tagsList: tagsList,
				cloudinary_public_id: "",
			})
		);

		localStorage.setItem("post-content", JSON.stringify(postContent));

		setLoading(0);
	};

	if (loading === 0) {
		captionMainBackground = (
			<>
				<button className="post-cover-image">
					<label for="cover-image-input">Add cover image</label>
					<input
						id="cover-image-input"
						type="file"
						accept="image/*"
						className="upload-cover-btn"
						name="cover-image"
						onChange={sendImage}
					/>
				</button>
				{uploadFailed ? (
					<div className="error-logs">
						<span>Image resolution must below 1920x1080</span>
					</div>
				) : null}
			</>
		);
	} else if (loading === 1) {
		captionMainBackground = (
			<>
				<Loader
					type="ThreeDots"
					color="#000"
					height={24}
					width={24}
					radius={0}
				/>
				<h4
					style={{
						marginLeft: "6px",
						fontSize: "17px",
					}}
				>
					Uploading
				</h4>
			</>
		);
	} else if (loading === 2) {
		localStorage.getItem("post-content");

		captionMainBackground = (
			<>
				<img
					src={coverUrl}
					style={{
						width: 235,
						height: 100,
						objectFit: "cover",
						borderRadius: "5px",
						marginRight: "1em",
					}}
				/>
				<div className="change-and-remove">
					<button
						className="post-cover-image"
						style={{
							padding: "0.5em 1em",
						}}
					>
						<label for="cover-image-input">Change</label>
						<input
							id="cover-image-input"
							type="file"
							accept="image/*"
							className="upload-cover-btn"
							name="cover-image"
							onChange={changeCaptionMainBackground}
						/>
					</button>

					<button
						className="post-cover-image removeBtn"
						style={{ padding: "0.5em 1em", border: "none" }}
						onClick={removeCaptionMainbackground}
					>
						<span
							style={{
								fontFamily: "Nunito",
								fontSize: "15px",
								fontWeight: "600",
								color: "red",
							}}
						>
							Remove
						</span>
					</button>
				</div>
			</>
		);
	}

	//image for CONTENT
	let contentImageComponent;

	//user upload image for their CONTENT inside
	let contentImageUpload = async (e) => {
		let files = e.target.files;
		let data = new FormData();
		data.append("file", files[0]);
		data.append("upload_preset", "bdyzskvu");

		setContentImageLoading(1);

		const response = await fetch(
			"https://api.cloudinary.com/v1_1/djbkxkx8m/image/upload",
			{
				method: "POST",
				body: data,
			}
		);

		const file = await response.json();

		setContentImageMarkdown(`![Alt Text](${file.secure_url})`);

		setContentImageLoading(2);
	};

	if (contentImageLoading === 1) {
		contentImageComponent = (
			<>
				<Loader
					type="ThreeDots"
					color="#000"
					height={24}
					width={24}
					radius={0}
					style={{ marginLeft: "10px" }}
				/>
			</>
		);
	} else if (contentImageLoading === 2) {
		contentImageComponent = (
			<>
				<div className="markdown-image">
					<input
						className="markdown-image-syntax"
						readOnly
						value={contentImageMarkdown}
						onClick={contentImageAutoCopy}
					></input>

					<div className="popup" ref={popup}>
						<span>Copy to clipboard!</span>
					</div>
				</div>
			</>
		);
	}

	const changePostContent = (e) => {
		return (e) => {
			let {
				caption,
				mainbackground,
				category,
				content,
				tagsList,
				cloudinary_public_id,
			} = postContent;

			let textarea = JSON.parse(localStorage.getItem("textarea-height"));

			switch (e.target.ariaLabel) {
				case "Post Title":
					setCaptionHeight(e.target.style.scrollHeight);
					textarea.captionHeight = e.target.style.height;

					setPostContent(
						(postContent = {
							caption: e.target.value,
							mainbackground: mainbackground,
							category: category,
							content: content,
							tagsList: tagsList,
							cloudinary_public_id: cloudinary_public_id,
						})
					);

					break;
				case "Post Content":
					setContentHeight(e.target.style.height);
					textarea.contentHeight = e.target.style.height;

					setPostContent(
						(postContent = {
							caption: caption,
							mainbackground: mainbackground,
							category: category,
							content: e.target.value,
							tagsList: tagsList,
							cloudinary_public_id: cloudinary_public_id,
						})
					);

					break;
			}
			localStorage.setItem("textarea-height", JSON.stringify(textarea));
			localStorage.setItem("post-content", JSON.stringify(postContent));
		};
	};

	const postPostToApi = () => {
		let tagWords = tags.split(/\W+/);

		if (tagWords[tagWords.length - 1] === "") {
			tagWords = tagWords.slice(0, tagWords.length - 1);
		}

		if (tagWords[0] === "") {
			tagWords = tagWords.slice(1, tagWords.length);
		}

		postContent.tagsList = tagWords.slice(0, tagWords.length);

		axios.post(API_URL + "/addPost", { postContent });

		localStorage.removeItem("post-content");
		localStorage.removeItem("textarea-height");
		setLoading(0);
		setRedirect("/newsfeed");
	};

	const userAddEmoji = (emoji, event) => {
		let {
			caption,
			mainbackground,
			category,
			content,
			tagsList,
			cloudinary_public_id,
		} = postContent;

		setPostContent(
			(postContent = {
				caption: caption,
				mainbackground: mainbackground,
				category: category,
				content:
					content.slice(0, cursorPos) + emoji.native + content.slice(cursorPos),
				tagsList: tagsList,
				cloudinary_public_id: cloudinary_public_id,
			})
		);

		localStorage.setItem("post-content", JSON.stringify(postContent));
	};

	const triggerPostProperty = (e) => {
		const comboButtons = document.querySelectorAll(".combo-button");

		//Change state to change to post window
		switch (e.target.innerHTML) {
			case "Edit":
				{
					if (!e.target.classList.contains("isFocused")) {
						setComboButtonState(0);
					}

					setPostProperty("edit");
				}

				break;
			case "Preview":
				{
					if (!e.target.classList.contains("isFocused")) {
						setComboButtonState(1);
					}
					setPostProperty("preview");
				}
				break;
			default:
				setPostProperty("edit");
		}
	};

	return redirect !== null ? (
		<Redirect to={redirect} />
	) : (
		<div className="write-post">
			<div className="all-container">
				{postProperty === "edit" ? (
					<div className="left-side-block">
						<WritePostNavbar
							triggerPostProperty={triggerPostProperty}
							comboButtonState={comboButtonState}
						/>

						<div className="editing-content">
							<div className="post-header-field post-inner">
								<div className="upload-cover-image">
									{captionMainBackground}
								</div>

								<div className="article-form-title">
									<textarea
										type="text"
										id="article-form-title"
										placeholder="New post title here..."
										autocomplete="off"
										className="caption-textfield"
										aria-label="Post Title"
										autofocus="true"
										onKeyDown={preventNewLine()}
										onChange={changePostContent()}
										value={postContent.caption}
										style={{ height: captionHeight, resize: "none" }}
										ref={captionTextField}
									></textarea>
								</div>

								<input
									data-testid="tag-input"
									id="tag-input"
									type="text"
									placeholder="Add up to 4 tags..."
									autocomplete="off"
									className="tags-textfield"
									aria-label="Post Tag"
									pattern="[0-9A-Za-z, ]+"
									onKeyDown={preventNewLine()}
									onKeyUp={onKeyUp}
									onChange={changeTags}
									value={tags}
								></input>

								<div className="category-group">
									<label for="sel-btn" className="select-label">
										Give your recipe a category
									</label>

									<div className="select-area">
										<div
											className="select-button"
											id="sel-btn"
											onClick={dropOption}
										>
											<span>
												{postContent.category ? postContent.category : "Food"}
											</span>
											<div className="chevrons">
												<i className="fas fa-chevron-up icon-chevron"></i>
												<i className="fas fa-chevron-down icon-chevron"></i>
											</div>
										</div>
										<div className="options drop">
											{OPTIONS.map((option, index) => {
												return (
													<div
														className="option"
														onClick={userChooseOption}
														key={index}
													>
														{option.name}
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>

							<div className="post-body-field post-inner">
								<div className="content-image">
									<button className="post-content-image">
										<Icon path={mdiFileImageOutline} />
										<span>Upload Image</span>
										<input
											id="content-image-input"
											className="upload-image-btn"
											type="file"
											accept="image/*"
											name="content-image"
											onChange={contentImageUpload}
										/>
									</button>
									{contentImageComponent}
								</div>

								<div className="post-body-wrap-content">
									<textarea
										type="text"
										placeholder="Start your content ..."
										autocomplete="off"
										className="content-textfield"
										aria-label="Post Content"
										onChange={changePostContent()}
										onSelect={() => {
											let x = document.querySelector(".content-textfield");
											setCursorPos(x.selectionStart);
										}}
										value={postContent.content}
										style={{ height: contentHeight, resize: "none" }}
										ref={contentTextField}
									></textarea>
								</div>
							</div>
						</div>

						<div className="bottom-end  ml-5">
							<div className="publish-and-save">
								<a
									className="btn btn-outline-custom isFocused"
									onClick={postPostToApi}
								>
									Publish
								</a>

								<a className="btn btn-outline-custom">Save</a>
							</div>

							<div className="help.md">
								<i>
									You can use this file for syntax guiding{" "}
									<span>
										<a
											href="https://drive.google.com/file/d/1OY_yguuEG1qQezFM1_KVI0-U1elWMwbf/view"
											target="_blank"
											className="helpme"
										>
											help.md
										</a>
									</span>
								</i>
							</div>
						</div>

						<div className="tabs-list">
							<div
								className="tab emoji"
								onClick={(e) => {
									let tab = document.querySelectorAll(".tab");
									tab[0].classList.toggle("emoji-animation");

									let emojiMart = document.querySelector(".emoji-mart");
									emojiMart.classList.toggle("emoji-mart-hide-show");
								}}
							>
								<i className="fas fa-smile"></i>
								<p>Emoji</p>
							</div>

							<div
								className="tab guide"
								onClick={(e) => {
									let tab = document.querySelectorAll(".tab");
									console.log(tab);
									tab[1].classList.toggle("emoji-animation");
								}}
							>
								<i class="fas fa-info"></i>
								<p>Guide</p>
							</div>
						</div>

						<EmojiPicker userAddEmoji={userAddEmoji} />
					</div>
				) : (
					<Preview
						triggerPostProperty={triggerPostProperty}
						comboButtonState={comboButtonState}
					/>
				)}
			</div>
		</div>
	);
}

export default WritePost;
