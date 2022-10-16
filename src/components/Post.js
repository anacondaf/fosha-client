import React from "react";
import ReactMarkDown from "react-markdown";

import Icon from "@mdi/react";
import { mdiTagTextOutline, mdiCalendar, mdiArrowRight } from "@mdi/js";

function PostItem(props) {
	let { item } = props;

	return (
		<article className="post">
			<div className="post-header">
				<h2 className="post-title">
					<a href={`/view/${item._id}`}>{item.caption}</a>
				</h2>
				<ul className="post-meta">
					<li>
						<Icon clasName="mdi" path={mdiCalendar} />
						<a>{item.date}</a>
					</li>
					<li>
						<Icon clasName="mdi" path={mdiTagTextOutline} />{" "}
						<a>{item.tags.length} tags</a>
					</li>
					<li>
						<i className="far fa-save"></i>
						<a className="saved-button">Save</a>
					</li>
				</ul>
			</div>

			{item.mainbackground ? (
				<div className="post-preview">
					<a href={`/view/${item._id}`}>
						<img src={item.mainbackground} alt="" class="img-fluid rounded" />
					</a>
				</div>
			) : null}

			<div className="post-content">
				<ReactMarkDown children={item.description + " [...]"} />
			</div>

			<div>
				<a href={`/view/${item._id}`} class="btn btn-outline-custom">
					Read More <Icon path={mdiArrowRight} />
				</a>
			</div>
		</article>
	);
}

export default PostItem;
