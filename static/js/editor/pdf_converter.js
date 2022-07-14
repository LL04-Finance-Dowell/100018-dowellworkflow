//import { PDFDocument } from 'https://unpkg.com/pdf-lib/dist/pdf-lib.min.js';
//import { PDFdocument } from 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.js';
//import { PDFDocument2 } from 'https://unpkg.com/pdf-lib';
//import { PDFDocument3 } from 'https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.js';
//const PDFlib = import("https://unpkg.com/pdf-lib/dist/pdf-lib.js")
//https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.js

const pdfBtn = document.getElementById("convert-pdf");

pdfBtn.onclick = (event) => {
    const fileData = JSON.parse(document.getElementById('file-data').textContent);
    convert_to_pdf(fileData);
}

async function convert_to_pdf(d){
    const exportedVar = [];
    import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.js')
        .then(module => {
            const {default: defaultExport, ...rest} = module;
            exportedVar.push(defaultExport.name, ...Object.keys(rest));
            console.log(exportedVar);
        });



    // Create a new PDFDocument
   /* const pdfDoc = await PDFDocument.create()

    console.log(d)
    for(let pg = 0; pg < d.length ; ++pg){
        const page = pdfDoc.addPage([550, 750])
    }*/
}