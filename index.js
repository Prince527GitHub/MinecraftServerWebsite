#!/urs/bin/env node

// fix __dirname and __filename
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Packages
import fs from 'fs';
import download from 'download-git-repo';

// CLI packages
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function setup() {
    figlet("MSW Maker", (err, data) => {
        console.log(gradient.pastel.multiline(data));
    });

    await sleep();
	
	// <---------- IP ---------->
    let IP;
    const question_1 = await inquirer.prompt({
        name: 'IP',
        type: 'input',
        message: "What is the server's IP?",
    });

    if (!question_1.IP) {
        console.log('Please enter a IP.');
        process.exit(1);
    } else IP = question_1.IP;

	if (fs.existsSync(`${__dirname}/Web/${IP}`)) return console.log(chalk.blue("Sorry, but I there is already a folder with that name."));

	const downloadWeb = createSpinner("Download minecraft server template").start();
	
	await sleep();
	
	download("github:Prince527Github/MinecraftServerWebsite", `${__dirname}/Web/${IP}`, async function(err) {
		if (err) return downloadWeb.error({ text: "An error has accourd while download the template" });
		downloadWeb.success({ text: "Finished downloading" });

		await sleep();

		// <---------- Title ---------->
		let title;
		const question_2 = await inquirer.prompt({
			name: 'title',
			type: 'input',
			message: "What is the server's title (name)?",
		});

		if (!question_2.title) {
			console.log('Please enter a title (name).');
			process.exit(1);
		} else title = question_2.title;
		
		// <---------- Description ---------->
		let description;
		const question_3 = await inquirer.prompt({
			name: 'description',
			type: 'input',
			message: "What is the server's description?",
		});

		if (!question_3.description) {
			console.log('Please enter a description.');
			process.exit(1);
		} else description = question_3.description;
		
		// <---------- Color ---------->
		console.log(chalk.green("Color must be hex color code."));
		
		let color;
		const question_color = await inquirer.prompt({
			name: 'color',
			type: 'input',
			message: "What is the main color?",
		});

		if (!question_color.color) {
			console.log('Please enter a hex color code.');
			process.exit(1);
		} else color = question_color.color;
		
		// <---------- Names ---------->
		console.log(chalk.green("You can add mutiple names by spliting them with a comas.\nAlso note that the names must be there minecraft usernames."));
		
		let names = [];
		const question_4 = await inquirer.prompt({
			name: 'names',
			type: 'input',
			message: "What is the server's owners (admins, mods, etc)?",
		});

		if (!question_4.names) {
			console.log('Please enter some minecraft usernames.');
			process.exit(1);
		} else question_4.names.split(',').forEach(element => {
			if (element.length < 1) return;
			element.split(' ').forEach(elements => {
				if (elements.length < 1) return;
				names.push(elements);
			});
		});
		
		// <---------- Discord ---------->
		let discord;
		const question_5 = await inquirer.prompt({
			name: 'discord',
			type: 'input',
			message: "What is the server's discord?",
		});

		if (!question_5.discord) {
			console.log('Please enter a discord invite url.');
			process.exit(1);
		} else discord = question_5.discord;
		
		let content = [
			`<!DOCTYPE html>`,
			`<html lang="en-us">\n`,
			`<head>\n`,
			`	<meta name="viewport" content="width=device-width, initial-scale=1">\n`,
			`	<!-- ================= Discord web embed & description/title & twitter ================== -->\n`,
			`	<meta property="og:locale" content="en_US">`,
			`	<meta property="og:title" content="${title}" />`,
			`	<meta property="og:type" content="website" />`,
			`	<meta property="og:url" content="./index.html" />`,
			`	<meta property="og:image" content="./assets/image/icon.png" />`,
			`	<meta property="og:description" content="${description}" />`,
			`	<meta name="description" content="${description}">`,
			`	<meta name="twitter:card" content="summary_large_image">`,
			`	<meta name="twitter:title" content="${title}">`,
			`	<meta name="twitter:description" content="${description}">`,
			`	<meta name="twitter:image" content="./assets/image/icon.png">`,
			`	<meta name="theme-color" content="${color}">`,
			`	<title>${title}</title>\n`,
			`	<!-- ================= Favicon ================== -->\n`,
			`	<!-- Standard -->`,
			`	<link rel="shortcut icon" href="./assets/image/icon.png">\n`,
			`	<!-- Retina iPad Touch Icon -->`,
			`	<link rel="apple-touch-icon" sizes="144x144" href="./assets/image/icon.png">\n`,
			`	<!-- Retina iPhone Touch Icon -->`,
			`	<link rel="apple-touch-icon" sizes="114x114" href="./assets/image/icon.png">\n`,
			`	<!-- Standard iPad Touch Icon -->`,
			`	<link rel="apple-touch-icon" sizes="72x72" href="./assets/image/icon.png">\n`,
			`	<!-- Standard iPhone Touch Icon -->`,
			`	<link rel="apple-touch-icon" sizes="57x57" href="./assets/image/icon.png">\n`,
			`	<!-- ================= Styles & bootstrap ================== -->\n`,
			`	<link href="./assets/css/bootstrap.min.css" rel="stylesheet">`,
			`	<script src="./assets/js/bootstrap.bundle.min.js"></script>`,
			`	<script src="./assets/js/mc-player-counter.min.js"></script>`,
			`	<link href="./assets/css/style.min.css" rel="stylesheet">\n`,
			`</head>\n`,
			`<!-- ================= Some stuff ================== -->\n`,
			`<body style="padding-top:100px;">\n`,
			`	<div class="container-sm style-is-cool">\n`,
			`		<!-- ================= Name & logo ================== -->\n`,
			`		<div>`,
			`			<h1 style="color:${color};">${title}</h1>`,
			`			<img src="./assets/image/icon.png" alt="server-logo" width="128" height="128"></img>\n`,
			`			<!-- ================= Description of Server ================== -->\n`,
			`			<h6>${description}</h6>\n`,
			`			<h4>Join <span style="color:${color}" data-playercounter-ip="${IP}">0</span> other players on <span style="color:${color}">${IP}</span></h4>\n`,
			`		</div>`,
			`	</div>\n`,
			`	<div class="container-sm style-is-cool ">\n`,
			`		<div style="padding-top:10px;">\n`,
			`			<div class="stuff">\n`,
		];

		names.forEach(element => {
			content.push(`				<div>\n`);
			content.push(`					<h5 style="background-color:RGBA(9, 11, 6, 0.2);">${element}</h6>`);
			content.push(`						<img src="https://www.mc-heads.net/body/${element}" alt="${element}" width="90" height="216">\n`);
			content.push(`				</div>\n`);
		});

		content.push(`			</div>\n`);
		content.push(`		</div>\n`);
		content.push(`		<a href="${discord}" style="padding-top:10px;">`);
		content.push(`			<img src="./assets/image/discord.png" alt="discord" width="32" height="32">`);
		content.push(`		</a>\n`);
		content.push(`	</div>`);
		content.push(`</body>\n`);
		content.push(`</html>`);

		const makeHTML = createSpinner('Creating website').start();
		await sleep();

		// <---------- Create dir ---------->
		if (!fs.existsSync(`${__dirname}/Web/${IP}/`, { recursive: true })) fs.mkdirSync(`${__dirname}/Web/${IP}/`, { recursive: true });

		// <---------- Create file ---------->
        fs.writeFile(`${__dirname}/Web/${IP}/index.html`, content.join('\n'), async(err) => {
            if (err) return makeHTML.error({ text: "An error has accourd while creating website" });
			makeHTML.success({ text: "Finished creating website" });
        });
	});
}

await setup();