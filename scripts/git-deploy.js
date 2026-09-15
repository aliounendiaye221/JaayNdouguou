const fs = require('fs');
const { execSync } = require('child_process');

const candidatePaths = [
    'C:\\Program Files\\Git\\cmd\\git.exe',
    'C:\\Program Files\\Git\\bin\\git.exe',
    'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
    'C:\\Program Files (x86)\\Git\\bin\\git.exe',
    'C:\\Users\\aliou\\AppData\\Local\\Programs\\Git\\cmd\\git.exe',
    'C:\\Users\\aliou\\AppData\\Local\\Programs\\Git\\bin\\git.exe',
    'C:\\Users\\aliou\\AppData\\Local\\GitHubDesktop\\app-*\\resources\\app\\git\\cmd\\git.exe',
    'C:\\ProgramData\\chocolatey\\bin\\git.exe'
];

let gitPath = null;
for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
        gitPath = p;
        break;
    }
}

console.log('Found git at:', gitPath);

if (gitPath) {
    function run(cmd) {
        console.log(`> ${cmd}`);
        const out = execSync(`"${gitPath}" ${cmd}`, { encoding: 'utf-8' });
        if (out) console.log(out.trim());
    }

    run('status --short');
    run('add -A');
    run('commit -m "feat: ajout des 6 nouveaux produits (patate, limon, courgette, hibiscus, aubergine amere, pain de singe) avec photographies HD studio et referencement SEO"');
    console.log('Pushing to origin main...');
    run('push origin main');
    console.log('Git push completed successfully!');
} else {
    console.log('Scanning directories for git.exe...');
    const roots = ['C:\\Program Files', 'C:\\Program Files (x86)', 'C:\\Users\\aliou\\AppData\\Local'];
    for (const r of roots) {
        try {
            const files = fs.readdirSync(r);
            console.log(r, 'contains:', files.filter(f => f.toLowerCase().includes('git')));
        } catch (e) {}
    }
}
