class UserGenerator {
	constructor(model = false) {
		this.firstNamesM = this.readFile(
			"./assets/files/user/names/first-names-m.txt"
		);
		this.firstNamesF = this.readFile(
			"./assets/files/user/names/first-names-f.txt"
		);
		this.lastNames = this.readFile(
			"./assets/files/user/names/last-names.txt"
		);
		this.sportsTeams = this.readFile(
			"./assets/files/user/names/sports-teams.txt"
		);
		this.videoGames = this.readFile(
			"./assets/files/user/names/video-games.txt"
		);

		this.agreeComments = [];
		this.disagreeComments = [];
		this.complimentGuyComments = [];
		this.complimentGirlComments = [];
		this.exclamatoryComments = [];
		this.questionComments = [];
		this.goAwayComments = [];
		this.loveComments = [];
		this.hateComments = [];
		this.laughingComments = [];
		this.lastComments = [];
		this.lastProfilePictures = [];
		this.lastUsernames = [];

		if (model) {
			this.agreeComments = this.readFile(
				"./assets/files/user/comments/agree_comments.txt"
			);
			this.disagreeComments = this.readFile(
				"./assets/files/user/comments/disagree_comments.txt"
			);
			this.complimentGuyComments = this.readFile(
				"./assets/files/user/comments/complimenting_guy_comments.txt"
			);
			this.complimentGirlComments = this.readFile(
				"./assets/files/user/comments/complimenting_girl_comments.txt"
			);
			this.complimentCoupleComments = this.readFile(
				"./assets/files/user/comments/complimenting_couple_comments.txt"
			);
			this.exclamatoryComments = this.readFile(
				"./assets/files/user/comments/exclamatory_comments.txt"
			);
			this.questionComments = this.readFile(
				"./assets/files/user/comments/questioning_comments.txt"
			);
			this.goAwayComments = this.readFile(
				"./assets/files/user/comments/go_away_comments.txt"
			);
			this.loveComments = this.readFile(
				"./assets/files/user/comments/love_good_comments.txt"
			);
			this.hateComments = this.readFile(
				"./assets/files/user/comments/hate_comments.txt"
			);
			this.laughingComments = this.readFile(
				"./assets/files/user/comments/laughing_comments.txt"
			);
			this.loadModelAndTokenizer();
		}
	}

	readFile(filePath) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", filePath, false);
		xhr.send();

		if (xhr.status === 200) {
			return xhr.responseText.trim().split("\n");
		} else {
			console.error(`Failed to read file: ${filePath}`);
			return [];
		}
	}

	async loadModelAndTokenizer() {
		// Load the model
		/*this.model = await tf.loadGraphModel(
			"assets/models/distilgpt2/model.json"
		);
		// Load the tokenizer
		this.tokenizer = await fetch(
			"assets/models/distilgpt2/tokenizer.json"
		).then((response) => response.json());
		document.getElementById("generate-button").disabled = false;*/
	}

	async generateComment(topic) {
		const lastComments = this.lastComments || [];
		let commentsPool = [];
		let emojisPool = [];
		let comment;
		let willUseEmojis = window.chance(40);
		let agreeEmojis = [
			"👍",
			"👌",
			"👏",
			"🙌",
			"🤝",
			"✅",
			"✌️",
			"🤗",
			"💪",
			"🙆‍♂️",
			"🙆‍♀️",
			"👐",
			"🎉",
			"🥳",
			"🤩",
			"🤙",
			"🙏",
			"🎊",
			"🎈",
			"🌟",
			"💥",
			"💯",
			"✨",
			"🔥",
			"🎆",
			"🎇",
			"🥂",
			"🍻",
			"🌈",
			"😃",
		];

		let disagreeEmojis = [
			"👎",
			"👊",
			"🤝",
			"🤜",
			"🤛",
			"🙅",
			"🙅‍♂️",
			"🙅‍♀️",
			"🛑",
			"🚫",
			"❌",
			"⚠️",
			"💔",
			"🙍",
			"🙍‍♂️",
			"🙍‍♀️",
			"😠",
			"😡",
			"🤬",
			"😾",
			"👺",
			"🗯️",
			"🚷",
			"🛑",
			"👎🏼",
			"👎🏽",
			"👎🏾",
			"👎🏿",
			"👊🏻",
			"👊🏼",
		];

		let loveEmojis = [
			"💖",
			"💕",
			"💓",
			"💗",
			"💞",
			"❤️",
			"💘",
			"💝",
			"💟",
			"💑",
			"💏",
			"💋",
			"😍",
			"😘",
			"😻",
			"🥰",
			"🌹",
			"🌷",
			"🌸",
			"💐",
			"🧡",
			"💛",
			"💚",
			"💙",
			"💜",
			"🤎",
			"🖤",
			"🤍",
			"🌺",
			"🌼",
		];

		let laughingEmojis = [
			"😂",
			"🤣",
			"😭",
			"💀",
			"😹",
			"😆",
			"😅",
			"😁",
			"😄",
			"🤪",
			"🤭",
			"😜",
			"😝",
			"😛",
			"🤗",
			"🥳",
			"😇",
			"🤣",
			"😆",
			"😹",
		];

		let exclamatoryEmojis = [
			"🔥",
			"👀",
			"😱",
			"😍",
			"😎",
			"💥",
			"👏",
			"😮",
			"🤩",
			"😲",
			"✨",
			"🎉",
			"🎊",
			"🌟",
			"🙌",
			"🥳",
			"🎆",
			"🎇",
			"🆒",
			"💯",
			"⚡️",
			"🌈",
			"🔔",
			"🎈",
			"🌠",
			"📢",
			"📣",
			"🤯",
			"😵",
			"🥵",
		];

		let questionEmojis = [
			"❓",
			"❔",
			"🤔",
			"🧐",
			"🤨",
			"😕",
			"😟",
			"🤷",
			"🤷‍♂️",
			"🤷‍♀️",
			"🙄",
			"😐",
			"😶",
			"🤦",
			"🤦‍♂️",
			"🤦‍♀️",
			"👂",
			"🧏",
			"👀",
			"🔍",
			"🔎",
			"📖",
		];

		let goAwayEmojis = [
			"👋",
			"🖕",
			"🤚",
			"✋",
			"🖐",
			"✌️",
			"😤",
			"😒",
			"🙄",
			"🚶",
			"🚶‍♂️",
			"🚶‍♀️",
			"🏃",
			"🏃‍♂️",
			"🏃‍♀️",
			"💨",
			"🚫",
			"❌",
			"🙅",
			"🙅‍♂️",
			"🙅‍♀️",
			"🙎",
			"🙎‍♂️",
			"🙎‍♀️",
		];

		let hateEmojis = [
			"😡",
			"🤬",
			"💢",
			"👿",
			"😠",
			"👹",
			"👺",
			"🙅",
			"🙅‍♂️",
			"🙅‍♀️",
			"💔",
			"😾",
			"😤",
			"🖕",
			"🚫",
			"❌",
			"🙍",
			"🙍‍♂️",
			"🙍‍♀️",
			"🤢",
			"🤮",
			"😾",
			"🗯️",
			"🛑",
			"🚷",
			"⚠️",
			"🙎",
			"🙎‍♂️",
			"🙎‍♀️",
			"😾",
		];

		let complimentEmojis = [
			"😊",
			"😇",
			"🥰",
			"😍",
			"😘",
			"😻",
			"💖",
			"💘",
			"💝",
			"💗",
			"💓",
			"🌟",
			"🌹",
			"🌷",
			"🌸",
			"💐",
			"👍",
			"👏",
			"🙌",
			"🤩",
			"❤️",
			"🧡",
			"💛",
			"💚",
			"💙",
			"💜",
			"🤎",
			"🖤",
			"🤍",
			"🎉",
		];

		const getRandomComment = (comments) => {
			let newComment;
			do {
				newComment = this.randomElement(comments);
			} while (lastComments.includes(newComment));
			return newComment;
		};

		switch (topic) {
			case "agree":
				commentsPool = this.agreeComments;
				emojisPool = agreeEmojis;
				break;
			case "disagree":
				commentsPool = this.disagreeComments;
				emojisPool = disagreeEmojis;
				break;
			case "compliment-guy":
				commentsPool = this.complimentGuyComments;
				emojisPool = complimentEmojis;
				break;
			case "compliment-girl":
				commentsPool = this.complimentGirlComments;
				emojisPool = complimentEmojis;
				break;
			case "compliment-couple":
				commentsPool = this.complimentCoupleComments;
				emojisPool = complimentEmojis;
				break;
			case "exclamatory":
				commentsPool = this.exclamatoryComments;
				emojisPool = exclamatoryEmojis;
				break;
			case "question":
				commentsPool = this.questionComments;
				emojisPool = questionEmojis;
				break;
			case "go-away":
				commentsPool = this.goAwayComments;
				emojisPool = goAwayEmojis;
				break;
			case "love":
				commentsPool = this.loveComments;
				emojisPool = loveEmojis;
				break;
			case "hate":
				commentsPool = this.hateComments;
				emojisPool = hateEmojis;
				break;
			case "laughing":
				commentsPool = this.laughingComments;
				emojisPool = laughingEmojis;
				break;
			default:
				comment = "I don't know what to say";
				emojisPool = exclamatoryEmojis;
				break;
		}
		comment = getRandomComment(commentsPool);
		let emojiCount = window.randomIntRange(1, 3);
		let emojis = [];
		for (let i = 0; i < emojiCount; i++)
			emojis.push(this.randomElement(emojisPool));
		if (willUseEmojis) comment += " " + emojis.join("");
		// Update the lastComments array
		lastComments.push(comment);
		if (lastComments.length > Math.floor(commentsPool.length / 2) + 1) {
			lastComments.shift();
		}
		this.lastComments = lastComments;

		return comment;
	}

	async generateUsername(gender) {
		let username;
		do {
			let type = Math.floor(Math.random() * 13) + 1;
			switch (type) {
				case 1:
					username = this.generateType1(gender);
					break;
				case 2:
					username = this.generateType2(gender);
					break;
				case 3:
					username = this.generateType3(gender);
					break;
				case 4:
					username = this.generateType4(gender);
					break;
				case 5:
					username = this.generateType5(gender);
					break;
				case 6:
					username = this.generateType6(gender);
					break;
				case 7:
					username = this.generateType7(gender);
					break;
				case 8:
					username = this.generateType8(gender);
					break;
				case 9:
					username = this.generateType9(gender);
					break;
				case 10:
					username = this.generateType10(gender);
					break;
				case 11:
					username = this.generateType11(gender);
					break;
				case 12:
					username = this.generateType12(gender);
					break;
				case 13:
					username = this.generateType13(gender);
					break;
			}
		} while (this.lastUsernames.includes(username));

		this.lastUsernames.push(username);
		if (this.lastUsernames.length > 5) {
			// Adjust size of the history as needed
			this.lastUsernames.shift();
		}

		return username;
	}

	generateType1(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const firstName = this.randomElement(this.firstNames);
		const year =
			Math.floor(Math.random() * (new Date().getFullYear() - 1995 + 1)) +
			1995;
		return `${firstName}_${year}`;
	}

	generateType2(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const firstName = this.randomElement(this.firstNames);
		const lastName = this.randomElement(this.lastNames);
		return `${firstName}${lastName}`;
	}

	generateType3(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const lastName = this.randomElement(this.lastNames);
		const sportsTeam = this.randomElement(this.sportsTeams);
		return `${lastName}-${sportsTeam}`;
	}

	generateType4(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const randomChars = this.randomCharsWithVowel(4);
		const firstName = this.randomElement(this.firstNames);
		return `${randomChars}_${firstName}`;
	}

	generateType5(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const firstName = this.randomElement(this.firstNames);
		const randomChars = this.randomCharsWithVowel(4);
		return `${firstName}${randomChars}`;
	}

	generateType6(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const firstName = this.randomElement(this.firstNames);
		const lastName = this.randomElement(this.lastNames);
		const sportsTeam = this.randomElement(this.sportsTeams);
		return `${firstName}${lastName.charAt(0)}${sportsTeam.charAt(0)}`;
	}

	generateType7(gender) {
		const videoGame = this.randomElement(this.videoGames);
		const randomNum = Math.floor(Math.random() * 1000);
		return `${videoGame}${randomNum}`;
	}

	generateType8(gender) {
		const sportsTeam = this.randomElement(this.sportsTeams);
		const lastName = this.randomElement(this.lastNames);
		return `${sportsTeam}${lastName}`;
	}

	generateType9(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const firstName = this.randomElement(this.firstNames);
		const lastName = this.randomElement(this.lastNames);
		const randomNum = Math.floor(Math.random() * 100);
		return `${firstName.charAt(0)}${lastName}${randomNum}`;
	}

	generateType10(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const lastName = this.randomElement(this.lastNames);
		const sportsTeam = this.randomElement(this.sportsTeams);
		const randomChars = this.randomCharsWithVowel(3);
		return `${randomChars}${lastName}${sportsTeam.charAt(0)}`;
	}

	generateType11(gender) {
		const lastName = this.randomElement(this.lastNames);
		const sportsTeam = this.randomElement(this.sportsTeams);
		const sportsTeamAcronym = sportsTeam
			.split(" ")
			.map((word) => word.charAt(0))
			.join("");
		return `${lastName}${sportsTeamAcronym}`;
	}

	generateType12(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const firstName = this.randomElement(this.firstNames);
		const randomChars = this.randomCharsWithVowel(3);
		const year =
			Math.floor(Math.random() * (new Date().getFullYear() - 2000 + 1)) +
			2000;
		return `${firstName}${randomChars}${year}`;
	}

	generateType13(gender) {
		if (gender == "m") {
			this.firstNames = this.firstNamesM;
		} else {
			this.firstNames = this.firstNamesF;
		}
		const videoGame = this.randomElement(this.videoGames);
		const firstName = this.randomElement(this.firstNames);
		const sportsTeam = this.randomElement(this.sportsTeams);
		return `${videoGame}${firstName.charAt(0)}${sportsTeam.charAt(0)}`;
	}

	async generateProfilePicture(gender) {
		let profilePicture;
		do {
			const number = Math.floor(Math.random() * 90) + 1;
			profilePicture = `./assets/images/profiles/${gender}_${number}.jpg`;
		} while (this.lastProfilePictures.includes(profilePicture));

		this.lastProfilePictures.push(profilePicture);
		if (this.lastProfilePictures.length > 5) {
			// Adjust size of the history as needed
			this.lastProfilePictures.shift();
		}

		return profilePicture;
	}

	randomElement(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	randomCharsWithVowel(length) {
		const consonants = "bcdfghjklmnpqrstvwxyz";
		const vowels = "aeiou";
		let chars = "";

		for (let i = 0; i < length; i++) {
			if (i === Math.floor(length / 2)) {
				chars += vowels.charAt(
					Math.floor(Math.random() * vowels.length)
				);
			} else {
				chars += consonants.charAt(
					Math.floor(Math.random() * consonants.length)
				);
			}
		}
		return chars;
	}
}
