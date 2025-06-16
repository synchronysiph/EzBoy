javascript:(function() {
    const linkElements = document.querySelectorAll('link[href], img[src]');
    const fileUrls = Array.from(linkElements).map(el => el.href || el.src).filter(Boolean);
    const htmlContent = document.documentElement.outerHTML;

    // Criar um blob com o HTML
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'index.html';
    htmlLink.click();

    // Baixar os arquivos referenciados
    fileUrls.forEach(url => {
        const fileBlob = new Blob([fetch(url).then(response => response.blob())], { type: 'application/octet-stream' });
        const fileLink = document.createElement('a');
        const fileUrl = URL.createObjectURL(fileBlob);
        fileLink.href = fileUrl;
        fileLink.download = url.split('/').pop();
        fileLink.click();
    });

    alert('Download iniciado!');
})();
