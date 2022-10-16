import React from "react";

//css
import "./homepage.style.css";

function Homepage() {
	return (
		<div className="homepage">
			<div className="overlay"></div>

			<div className="typewritter">
				<h1>
					<p
						class="typewrite"
						data-period="2000"
						data-type='[ "Hi! We are FoSha", "We are social", "We are creative", "We made for culinary art" ]'
					>
						<span class="wrap"></span>
					</p>
				</h1>
			</div>

			<div className="buttons-group">
				<a href="/newsfeed" class="btn-getstarted-custom">
					<span>get started</span>
				</a>
			</div>
		</div>
	);
}

export default Homepage;
