const fs = require('fs');

const cssFiles = ['styles.css', 'styles-v2.css'];
const cssToAdd = `
.container {
    width: 100%;
    height: 100vh;
    background: transparent;
    display: flex;
    flex-direction: column;
    overflow: auto;
}
`;

cssFiles.forEach(file => {
    let css = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, css + cssToAdd, 'utf8');
});

console.log('Fixed container styles');
