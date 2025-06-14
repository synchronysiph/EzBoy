(async () => {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.zIndex = '9999';
    popup.style.background = '#222';
    popup.style.color = '#fff';
    popup.style.padding = '15px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    popup.innerHTML = '⌛ Carregando resposta...';
    document.body.appendChild(popup);

    const text = document.body.innerText;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer SUA_API_KEY',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Você é um assistente que responde apenas perguntas do site, ignorando design, código e tudo mais.' },
                { role: 'user', content: `Aqui está o texto do site:\n\n${text}\n\nMe dê as respostas diretas das perguntas.` }
            ],
            max_tokens: 500,
        })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '❌ Erro ao obter resposta';

    popup.innerHTML = `
        <strong>Respostas:</strong><br>${answer}<br><br>
        <button onclick="this.parentElement.remove()">❌ Fechar</button>
    `;
})();
