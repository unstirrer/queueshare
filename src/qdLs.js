import fs from 'node:fs';

for (const child of await fs.promises.readdir('.')) {

    if (child.includes('qc') || child.includes('Qc')) {

        console.log(child);
    
    }

}
