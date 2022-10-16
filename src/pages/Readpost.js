import React, { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";
import { Icon } from "@mdi/react";
import { mdiCheckboxBlankCircle } from "@mdi/js";
import axios from "axios";

import { useParams } from "react-router-dom";

//URL
import { API_URL } from "../config/url";

//css
import "./readpost.style.css";

function Readpost(props) {
	let [post, setPostContent] = useState({
		caption: "",
		mainbackground: "",
		category: "Food",
		content: "",
		tags: [],
	});

	let { post_id } = useParams();

	useEffect(() => {
		axios
			.get(`${API_URL}/getPosts/${post_id}`)
			.then((result) => {
				setPostContent(result.data.postContent);
			})
			.catch((error) => console.log(error));
	}, []);

	return (
		<div className="read-post">
			<div className="app-container">
				<div className="view-content">
					<img
						src={post.mainbackground}
						style={{ width: "100%", height: 300, objectFit: "cover" }}
					></img>

					<div className="content-main">
						<div className="content-header">
							<h2 className="post-caption" style={{ margin: 0, fontSize: 30 }}>
								{post.caption}
							</h2>

							<ul className="tags">
								{post.tags.map((tag) => {
									if (tag !== "") {
										return (
											<li>
												<a># {tag}</a>
											</li>
										);
									}
								})}
							</ul>

							<div className="author-date">
								<div className="author">
									<a>
										<img src="https://yt3.ggpht.com/ytc/AAUvwnhSeGCbeHJD09S7X-Qo8yuQKJqYdHa85OqkBDzSmg=s900-c-k-c0x00ffffff-no-rj"></img>
									</a>
									<a className="author-name" href="#">
										Gordon Ramsay
									</a>
								</div>

								<div className="date">
									<p>{post.date}</p>
									<Icon path={mdiCheckboxBlankCircle} />
									<p>2 min read</p>
								</div>
							</div>
						</div>

						<div className="content-body">
							<ReactMarkDown children={post.content} />
						</div>
					</div>
				</div>

				<div className="author-detail">
					<div className="style-on-top"></div>

					<div className="data-inner">
						<div className="upper-part">
							<img
								className="user-avatar"
								src="https://yt3.ggpht.com/ytc/AAUvwnhSeGCbeHJD09S7X-Qo8yuQKJqYdHa85OqkBDzSmg=s900-c-k-c0x00ffffff-no-rj"
								style={{
									width: 60,
									height: 60,
									objectFit: "cover",
									borderRadius: "100%",
								}}
							></img>

							<a className="author-name" href="#">
								Gordon Ramsay
							</a>
						</div>

						<div className="below-part">
							<button>
								<span>Follow</span>
							</button>
							<div className="join-date">
								<p>JOINED</p>
								<p className="full-date">Jun 13, 2020</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Readpost;
