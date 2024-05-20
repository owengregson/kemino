async function preloadData() {
	const status = document.getElementById("loadingStatus");
	/* Images */
	let maxIndex = 90;
	for (i = 1; i <= maxIndex * 2; i++) {
		let g = i <= maxIndex ? "m" : "w";
		let n = i <= maxIndex ? i : i - maxIndex;

		status.textContent = "Loading Profile " + i + "/" + maxIndex * 2;
		let img = new Image();
		img.src = `./assets/images/profiles/${g}_${n}.jpg`;
		await new Promise((resolve, reject) => {
			img.onload = resolve;
			img.onerror = reject;
		});
	}
	/* Comments */
	status.textContent = "Loading Comments";
	const cGen = new UserGenerator(true);
	status.textContent = "Initializing";
}
document.addEventListener("DOMContentLoaded", function () {
	preloadData().then(() => {
		const preloader = document.getElementById("preloader");
		const loading = document.querySelector(".loading");
		loading.style.opacity = 0;
		setTimeout(() => {
			loading.addEventListener("transitionend", function () {
				preloader.style.opacity = 0;
				setTimeout(() => {
					preloader.addEventListener("transitionend", function () {
						preloader.style.display = "none";
					});
				}, 10);
			});
		}, 10);
		const configScreen = document.getElementById("config-screen");
		const okButton = document.getElementById("ok-button");
		const camera = document.getElementById("camera");
		const commentsContainer = document.getElementById("comments");
		const paddingElement = document.getElementById("padding");
		let isScrolling = false;
		let commentQueue = [];
		let totalPaddingHeight = 0;
		let simulationTime = 0;
		let peakViewers = 30000;
		let initialViewers = Math.round(peakViewers / 7.5);
		let currentViewers = initialViewers;
		let username;
		const commentGenerator = new UserGenerator(true);
		const nameGenerator = new UserGenerator(false);
		window.currentTopic = "exclamatory";
		isReady = false;
		let cStream;


		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(function (stream) {

				cStream = stream;
				isReady = true;
			})
			.catch(function (err) {
				console.error("Error accessing camera: ", err);
			});

		document
			.getElementById("upload-button")
			.addEventListener("click", function () {
				document.getElementById("profile-picture").click();
			});
		document
			.getElementById("username")
			.addEventListener("input", function (event) {
				const usernameInput = event.target;
				const usernameError = document.getElementById("username-error");
				const invalidCharacters = /[^a-z0-9_-]/g;
				if (invalidCharacters.test(usernameInput.value)) {
					usernameInput.value = usernameInput.value.replace(
						invalidCharacters,
						""
					);
					usernameError.style.display = "block";
					usernameError.textContent =
						"Username can only contain lowercase letters, numbers, and hyphens/underscores.";
				} else {
					usernameError.style.display = "none";
					usernameError.textContent = "";
				}
			});

		document
			.getElementById("profile-picture")
			.addEventListener("change", function (event) {
				const preview = document.getElementById(
					"profile-picture-preview"
				);
				const file = event.target.files[0];
				const reader = new FileReader();

				reader.onloadend = function () {
					preview.style.backgroundImage = `url(${reader.result})`;
				};

				if (file) {
					reader.readAsDataURL(file);
				} else {
					preview.style.backgroundImage = "none";
				}
			});

		document
			.getElementById("config-form")
			.addEventListener("submit", function (event) {
				event.preventDefault();
				if (document.getElementById("username").value === "") {
					document.getElementById("username-error").style.display = "block";
					document.getElementById("username-error").textContent =
						"Please enter a username.";
					return;
				}

				if (document.getElementById("profile-picture-preview").style.backgroundImage === "none" || document.getElementById("profile-picture-preview").style.backgroundImage === "") {
					document.getElementById("userIcon").querySelector("img").src = "./assets/images/profile.png";
				} else {
					document.getElementById("userIcon").querySelector("img").src =
						document
							.getElementById("profile-picture-preview")
							.style.backgroundImage.slice(5, -2);
				}
				username = document.getElementById("username").value;
				peakViewers = parseInt(
					document.getElementById("max-viewer-count").value
				);
				initialViewers = Math.round(peakViewers / 7.5);
				currentViewers = initialViewers;


				if (isReady) {
					isReady = false;
					setTimeout(() => {
						startLiveStream();
					}, 50);
					let screen = document.getElementById("config-screen");
					screen.style.backgroundColor = "rgba(0, 0, 0, 1.0)";
					setTimeout(() => {
						screen.addEventListener("transitionend", function () {
							document.getElementById("userName").textContent =
								username;
						});
					}, 10);
					let container = document.querySelector(".config-container");
					container.innerHTML = "";
					let loading = document.createElement("div");
					loading.className = "loading";
					loading.innerHTML = `
					<div class="loading-text">Starting...</div>
					<div class="loading-spinner"></div>
				`;
					container.appendChild(loading);
					setTimeout(() => {
						screen.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
						camera.srcObject = cStream;
						screen.style.animation =
							"fadeOut 0.6s ease-in-out forwards";
						container.style.animation =
							"minimize 0.5s ease-in-out forwards";
						screen.addEventListener("animationend", function () {
							screen.style.display = "none";
							document.querySelector(
								".button-grid"
							).style.display = "grid";
						});
						container.addEventListener("animationend", function () {
							container.style.display = "none";
						});
					}, 5000);
				}
			});

		window.randomIntRange = (min, max) => {
			return Math.floor(Math.random() * (max - min + 1) + min);
		};

		
		async function createComment() {
			const comment = document.createElement("div");
			comment.className = "comment";

			const commentUserIcon = document.createElement("div");
			commentUserIcon.className = "comment-user-icon";

			const img = document.createElement("img");
			img.className = "comment-icon";

			const gender = Math.random() > 0.5 ? "m" : "w";
			const number = Math.floor(Math.random() * 90) + 1;
			img.src = await nameGenerator.generateProfilePicture(gender);
			img.alt = "User Icon";

			const commentText = document.createElement("div");
			commentText.className = "comment-text";

			const commentUsername = document.createElement("div");
			commentUsername.className = "comment-username";
			commentUsername.textContent = await nameGenerator.generateUsername(
				gender
			);

			let commentString = await commentGenerator.generateComment(
				window.currentTopic
			);
			const commentContent = document.createTextNode(commentString);

			commentText.appendChild(commentUsername);
			commentText.appendChild(commentContent);
			commentUserIcon.appendChild(img);
			comment.appendChild(commentUserIcon);
			comment.appendChild(commentText);

			commentQueue.push(comment);
		}

		function processCommentQueue() {
			if (!isScrolling) {
				while (commentQueue.length > 0) {
					const comment = commentQueue.shift();
					commentsContainer.appendChild(comment);
				}
			}
		}


		function handleButtonClick(event) {
			const buttonType = event.currentTarget.getAttribute("data-button");
			if (!buttonType) return;
			console.log("buttontype: " + buttonType);
			console.log("old topic: " + window.currentTopic);
			window.currentTopic = buttonType;
			console.log("new topic: " + window.currentTopic);
		}


		document.querySelectorAll(".grid-button").forEach((button) => {
			button.addEventListener("click", handleButtonClick);
		});

		window.createReaction = (emoji) => {
			if (emoji === undefined) {
				let emojiPool = [
					"👍",
					"❤️",
					"❤️",
					"😂",
					"❤️",
					"❤️",
					"😍",
					"❤️",
					"❤️",
					"🔥",
					"❤️",
					"❤️",
					"😡",
					"❤️",
					"❤️",
					"😭",
					"❤️",
					"❤️",
				];
				emoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
			}
			const reactions = document.getElementById("reactions");
			const reaction = document.createElement("div");
			reaction.classList.add("reaction");
			reaction.textContent = emoji;
			reactions.appendChild(reaction);
			const xTranslate = Math.random() * 30 - 35;
			const yTranslate = Math.random() * 100 + 130;
			reaction.style.setProperty("--x-translate", xTranslate);
			reaction.style.setProperty("--y-translate", yTranslate);
			reaction.addEventListener("animationend", function () {
				reaction.remove();
			});
		};

		function formatViewers(viewers) {
			if (viewers >= Number.MAX_SAFE_INTEGER - 1) {
				return "∞";
			} else if (viewers >= 1000000000000) {
				return `${(viewers / 1000000000000).toFixed(1)}` + "t";
			} else if (viewers >= 1000000000) {
				return `${(viewers / 1000000000).toFixed(1)}` + "b";
			} else if (viewers >= 1000000) {
				return `${(viewers / 1000000).toFixed(1)}` + "m";
			} else if (viewers >= 1000) {
				return `${(viewers / 1000).toFixed(1)}` + "k";
			}
			return viewers;
		}

		function updateViewCount() {

			const L = peakViewers;
			const maxGrowthPerTick = Math.ceil(peakViewers / 13);
			const minGrowthPerTick = Math.ceil(peakViewers / 100);
			const k = 0.3;
			const totalSimulationTime = 200;
			const x0 = totalSimulationTime / 2;

			if (currentViewers < peakViewers * 0.99) {

				let growthFactor =
					L / (1 + Math.exp(-k * (simulationTime - x0)));
				let grow =
					Math.ceil(Math.abs(growthFactor - currentViewers)) +
					Math.ceil(0.005 * currentViewers);
				grow = Math.min(grow, maxGrowthPerTick);
				grow = Math.ceil(
					(grow * (peakViewers - currentViewers)) / peakViewers
				);
				grow = Math.max(grow, minGrowthPerTick);
				grow = window.randomIntRange(
					grow - grow * 0.1,
					grow + grow * 0.1
				);
				console.log(`Grow Amount: ${grow}`);
				currentViewers += grow;


				if (currentViewers > peakViewers * 0.99) {
					currentViewers = Math.round(peakViewers * 0.99);
				}
			} else if (
				currentViewers >= peakViewers * 0.99 &&
				currentViewers <= peakViewers * 1.01
			) {

				let outerOscillation =
					peakViewers * 0.01 * Math.sin(0.1 * simulationTime);

				let innerOscillation =
					peakViewers * 0.005 * Math.sin(0.5 * simulationTime);
				currentViewers = Math.round(
					peakViewers + outerOscillation + innerOscillation
				);


				if (currentViewers > peakViewers * 1.01) {
					currentViewers = Math.round(peakViewers * 1.01);
				} else if (currentViewers < peakViewers * 0.99) {
					currentViewers = Math.round(peakViewers * 0.99);
				}
			} else if (currentViewers > peakViewers * 1.01) {

				currentViewers = Math.round(peakViewers * 1.01);
			}


			console.log(`Updated Current Viewers: ${currentViewers}`);


			document.getElementById("viewerCountNumber").textContent =
				formatViewers(currentViewers);


			simulationTime += 1;
		}


		function generateRandomCommentTime() {
			return window.randomIntRange(500, 700);
		}

		function generateRandomReactionTime() {
			return window.randomIntRange(80, 400);
		}

		function updateContent() {
			setTimeout(() => {
				createComment();
				updateContent();
			}, generateRandomCommentTime());
		}

		function startLiveStream() {
			updateContent();
			updateReactions();
			setInterval(() => {
				updateViewCount();
			}, 1400);
			setInterval(() => {
				if (!isScrolling) {
					isScrolling = true;


					const lastComment = commentsContainer.lastElementChild;
					if (lastComment) {
						const lastCommentHeight = lastComment.offsetHeight;
						commentsContainer.scrollTo({
							top:
								commentsContainer.scrollHeight -
								commentsContainer.clientHeight +
								lastCommentHeight,
							behavior: "smooth",
						});


						setTimeout(() => {
							isScrolling = false;
							processCommentQueue();
						}, 500);
					} else {
						isScrolling = false;
						processCommentQueue();
					}
				}


				if (
					totalPaddingHeight >
					(window.randomIntRange(60, 100) / 100) *
						(commentsContainer.clientHeight * 20)
				) {
					const currentScrollTop = commentsContainer.scrollTop;
					const paddingHeight = parseInt(
						paddingElement.style.height || "0"
					);

					paddingElement.style.height = "0px";
					totalPaddingHeight = 0;


					commentsContainer.scrollTop =
						currentScrollTop - paddingHeight;
				}
			}, 1000);
		}

		function updateReactions() {
			setTimeout(() => {
				window.createReaction();
				updateReactions();
			}, generateRandomReactionTime());
		}

		const observer = new MutationObserver((mutationsList) => {
			mutationsList.forEach((mutation) => {
				if (mutation.type === "childList") {

					mutation.removedNodes.forEach((removedNode) => {
						if (
							removedNode.classList &&
							removedNode.classList.contains("comment")
						) {
							const heightToAdd = removedNode.offsetHeight;
							totalPaddingHeight += heightToAdd;
							paddingElement.style.height = `${
								parseInt(paddingElement.style.height || "0") +
								heightToAdd
							}px`;
						}
					});


					while (commentsContainer.children.length > 11) {
						const oldestComment = commentsContainer.children[1];
						const heightToAdd = oldestComment.offsetHeight;
						totalPaddingHeight += heightToAdd;
						paddingElement.style.height = `${
							parseInt(paddingElement.style.height || "0") +
							heightToAdd
						}px`;
						oldestComment.remove();
					}
				}
			});
		});

		observer.observe(commentsContainer, { childList: true });


		/*function quadraticScrollToBottom(element, duration, deleteOldest=false) {
			const start = element.scrollTop;
			const end = element.scrollHeight - element.clientHeight;
			const change = end - start;
			const startTime = performance.now();

			function animateScroll(currentTime) {
				const elapsed = currentTime - startTime;
				const t = Math.min(1, elapsed / duration);
				const easeInQuad = t * t;
				element.scrollTop = start + change * easeInQuad;

				if (t < 1) {
					requestAnimationFrame(animateScroll);
				}
			}

			requestAnimationFrame(animateScroll);
		}*/


		window.chance = (percentage) => {
			return Math.random() * 100 < percentage;
		};
	});
});
