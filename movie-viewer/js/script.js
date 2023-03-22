const mainDivs = document.querySelectorAll(".container-fluid");
let totalChildren = 0;

mainDivs.forEach((div) => {
	totalChildren += div.children.length;
});

document.title = `Film Count: ${totalChildren}`;
