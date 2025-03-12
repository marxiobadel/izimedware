import React from "react";
import { DEVNAME } from "../constant/theme";

const Footer = () => {
	var d = new Date();
	return (
		<div className="footer out-footer">
			<div className="copyright">
				<p>Copyright © 
					{/* Designed &amp;  */}
					{" "}Developée par{" "}
					<a href="https://izipresta.com/" target="_blank" rel="noreferrer">
						{DEVNAME}
					</a>{" "}
					2024 - {d.getFullYear()}
				</p>
			</div>
		</div>
	);
};

export default Footer;
